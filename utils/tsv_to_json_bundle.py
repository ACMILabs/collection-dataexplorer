#
#	ACMI Collections - Convert Collections TSV to JSON
#
#	This script takes a processed .tsv file, from the ACMI Collection data set available at:
#
#	https://github.com/ACMILabs/collection
#
#
#	The output is quite a large JSON file that can be uploaded directly to a NoSQL database such as Firebase,
#	along with individual JSON files for each record, stored in folders grouped by system_id, split into
#	groups of 3.
#
#	Some stats and indexes are built to allow for easier pre-constructed 'queries', to make the data slightly
#	easier to explore. This can be useful to get started working with the data, without having to worry about
#	configuring servers or putting Elastic Search in front of the data-set.
#
#	Data formatting:
#
#	Key names are lowercase, words separated by underscores '_', more info in the collection repo link above.
#
#	The 'stats' and 'indexes' 

import sys
import csv
import codecs
import json
import urllib
import re
import os
import os.path
import collections
import copy

DEFAULT_FILENAME = "src/collections_data.tsv"
DEFAULT_DESTINATION_JSON = "dist/collections_data"
DEFAULT_DESTINATION_JSON_BUCKET = "dist/json"
KEY_PREPEND = "k_"


# For creating directory structure for individual JSON files, thank you Cooper Hewitt!
# github.com/cooperhewitt/collection
def id2path(id):
	tmp = str(id)
	parts = []
	while len(tmp) > 3:
		parts.append(tmp[0:3])
		tmp = tmp[3:]

	if len(tmp):
		parts.append(tmp)

	return os.path.join(*parts)

def get_alpha_num_string(source_string):
	return_string = ""
	match = re.findall(r"\w+", source_string)
	if match:
		return_string = "_".join(match).lower()
	return return_string

def add_or_zero(list_to_check, val):
	return_val = 1
	if val in list_to_check:
		return_val = list_to_check[val]["total"] + 1
	return return_val

def add_indexes(indexes, key_to_check, val, row):
	# Work through building the indexes
	if key_to_check in indexes:
		# split pipe separated values
		if (key_to_check == "genre" 
				or key_to_check == "form"
				or key_to_check == "subject_group"
				or key_to_check == "active_carriers_public_types_and_formats_only"
				or key_to_check == "creator_contributor_role"):
			val_list = val.split(" | ")
			for split_val in val_list:
				index_val = KEY_PREPEND + get_alpha_num_string(split_val)
				if not index_val in indexes[key_to_check]:
					indexes[key_to_check][index_val] = {"name": split_val, "titles": []}
				indexes[key_to_check][index_val]["titles"].append({
						"id": row[0],
						"title": row[4],
						"year": row[8]
				})
		else:
			index_val = KEY_PREPEND + get_alpha_num_string(val)
			if not index_val in indexes[key_to_check]:
				indexes[key_to_check][index_val] = {"name": val, "titles": []}
			indexes[key_to_check][index_val]["titles"].append({
				"id": row[0],
				"title": row[4],
				"year": row[8]
			})
	return indexes

def add_stats(stats, key_to_check, val):
	if key_to_check in stats:
		# split pipe separated values
		if (key_to_check == "genre"
				or key_to_check == "form"
				or key_to_check == "subject_group"
				or key_to_check == "active_carriers_public_types_and_formats_only"
				or key_to_check == "creator_contributor_role"):
			val_list = val.split(" | ")
			for split_val in val_list:
				parsed_split_val = KEY_PREPEND + get_alpha_num_string(split_val)
				if parsed_split_val not in stats[key_to_check]:
					stats[key_to_check][parsed_split_val] = {
						"name" : "",
						"total" : 0
					}
				stats[key_to_check][parsed_split_val]["name"] = split_val
				stats[key_to_check][parsed_split_val]["total"] = add_or_zero(stats[key_to_check], parsed_split_val)
		else:
			stats_val = KEY_PREPEND + get_alpha_num_string(val)
			if stats_val not in stats[key_to_check]:
				stats[key_to_check][stats_val] = {
					"name" : "",
					"total" : 0
				}
			stats[key_to_check][stats_val]["name"] = val
			stats[key_to_check][stats_val]["total"] = add_or_zero(stats[key_to_check], stats_val)
	return stats

def run_json_convert(filename):
	# open sourcee TSV file
	with open(filename, 'rU') as csvfile:
		# initialise the reader object on the source tsv, using Excel dialect, and specifying that it's tab delimited
		tsv_reader = csv.reader(csvfile, dialect="excel", delimiter="\t")
		# get the first row of the tsv, which is the column header row
		row = next(tsv_reader)
		# cache the first row, as we'll need to refer back to the column headers for generating our JSON keys
		row_zero = row
		# create an empty dictionary where we'll store all the data to be converted to JSON
		huge_json = {}
		# create an empty dictionary for all of the objects in the collection data TSV
		objects = {}
		# create a dictionary for our indexes, with some initial keys for pushing data into later
		categories = {
			"audience_classification" : {},
			"colour" : {},
			"creation_date" : {},
			"active_carriers_public_types_and_formats_only" : {},
			"form" : {},
			"genre" : {},
			"length" : {},
			"language_keywords" : {},
			"place_of_production" : {},
			"sound_audio" : {},
			"creator_contributor_role" : {},
			"subject_group" : {}
		}
		indexes = copy.deepcopy(categories)
		# create a dictionary for our stats, with some initial keys for pushing data into later
		stats = {
			"audience_classification" : {},
			"colour" : {},
			"creation_date" : {},
			"active_carriers_public_types_and_formats_only" : {},
			"form" : {},
			"genre" : {},
			"length" : {},
			"language_keywords" : {},
			"place_of_production" : {},
			"sound_audio" : {},
			"subject_group" : {}			
		}
		# iterate through the rows of the source tsv file
		iterator = 0
		for row in tsv_reader:
			# create empty dictionary for the row of key value pairs we'll be pushing to the object dictionary
			# this also resets the dictionary for each row we go through in this for loop
			row_key_val_pairs = collections.OrderedDict()
			# iterate through each column of the current row of the source tsv
			for idx, val in enumerate(row):
				# construct a key name from the column header (lowercase with dashes instead of spaces)
				key_name = str(row_zero[idx]).lower().replace(" ", "_")
				# add the value for this column to our dictionary of key value pairs for the row
				
				if (idx == 0):
					row_key_val_pairs.update({key_name: int(val)})
				elif (idx > 4):
					row_key_val_pairs.update({key_name: val.split(" | ")})
					#row_key_val_pairs[key_name] = val.split(" | ")
				else:
					row_key_val_pairs.update({key_name: val})
					#row_key_val_pairs[key_name] = val
				# Work through building the stats for this column
				stats = add_stats(stats, key_name, val)
				# Work through building the indexes for this column
				indexes = add_indexes(indexes, key_name, val, row)
			# add the dictionary of key / value pairs for the row to the objects dictionary, using the Object ID as the key name
			objects[str(row[0])] = row_key_val_pairs
			
			
			tmp_string = str(row[0])
			parts = []

			# Make sure that there's a directory for the individual JSON files

			if not os.path.exists(DEFAULT_DESTINATION_JSON_BUCKET + "/objects/" + id2path(str(row[0]))):
				os.makedirs(DEFAULT_DESTINATION_JSON_BUCKET + "/objects/" + id2path(str(row[0])))
			
			with open(DEFAULT_DESTINATION_JSON_BUCKET + "/objects/" + id2path(str(row[0])) + "/" + str(row[0]) + ".json", 'w') as json_output_file:
				json.dump(row_key_val_pairs, json_output_file, indent=4, sort_keys=False)

			# Update status in terminal
			iterator += 1
			status = "Parsing row: " + str(iterator) + " and saving to : " + DEFAULT_DESTINATION_JSON_BUCKET + "/objects/" + id2path(str(row[0])) + "/" + str(row[0]) + ".json"
			sys.stdout.write('%s\r' % status)
    		sys.stdout.flush()

		# attach the dictionaries to our huge_json
		huge_json["categories"] = categories
		huge_json["indexes"] = indexes
		huge_json["stats"] = stats
		huge_json["objects"] = objects

		# finally, dump the huge_json dictionary with all our data to JSON!
		# for testing, try adding indent=4 to the json.dump below to see the JSON pretty-printed.
		
		# update status in terminal
		sys.stdout.write('Saving to JSON file\n')
		sys.stdout.flush()

		# separate smaller json bundles
		with open("dist/objects.json", 'w') as json_output_file:
			json.dump({"objects": objects}, json_output_file, sort_keys=True)

		with open("dist/categories.json", 'w') as json_output_file:
			json.dump({"categories": categories}, json_output_file, sort_keys=True)

		with open("dist/indexes.json", 'w') as json_output_file:
			json.dump({"indexes": indexes}, json_output_file, sort_keys=True)

		with open("dist/stats.json", 'w') as json_output_file:
			json.dump({"stats": stats}, json_output_file, sort_keys=True)

		# one huge json bundle
		with open("dist/collections_data.json", 'w') as json_output_file:
			json.dump(huge_json, json_output_file, sort_keys=True)
			# Confirm complete!
			sys.stdout.write('Saving complete!\n')
			sys.stdout.flush()

def main():
	total = len(sys.argv)
	if total == 2:
		print ("Script name: %s" % str(sys.argv[0]))
		run_json_convert(str(sys.argv[1]))
	elif total == 1:
		print ("Script name: %s" % str(sys.argv[0]))
		run_json_convert(DEFAULT_FILENAME)
	else:
		print("Please enter a single .tsv filename at the command-line.")

main()
