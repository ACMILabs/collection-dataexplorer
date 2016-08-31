/*********************************************

  ACMI Collection Explorer

  By Andrew Serong for the Australian Centre for the Moving Image

  Follow us @ACMILabs on Twitter

  Repo located at: github.com/ACMILabs/collection-dataexplorer

  Some docs and tutorials that were helpful in putting this together:

  https://github.com/webpack/docs/wiki/optimization
  https://medium.com/@dabit3/beginner-s-guide-to-webpack-b1f1a3638460
  http://moduscreate.com/optimizing-react-es6-webpack-production-build/
  http://www.pro-react.com/materials/appendixA/
  https://www.codementor.io/reactjs/tutorial/beginner-guide-setup-reactjs-environment-npm-babel-6-webpack
  https://webpack.github.io/docs/list-of-tutorials.html
  https://tylermcginnis.com/react-js-tutorial-1-5-utilizing-webpack-and-babel-to-build-a-react-js-app-5f804d729d3b
  https://simonsmith.io/using-webpack-to-build-react-components-and-their-assets/
  https://robots.thoughtbot.com/setting-up-webpack-for-react-and-hot-module-replacement
  http://jmfurlott.com/tutorial-setting-up-a-single-page-react-web-app-with-react-router-and-webpack/
  http://andrejgajdos.com/setting-up-webpack-for-es6-react-sass-and-bootstrap/
  https://medium.com/@victorleungtw/how-to-use-webpack-with-react-and-bootstrap-b94d33765970

**********************************************/

import React from 'react';
import ReactDOM from 'react-dom';
import { createHistory, useBasename } from 'history';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import TweenMax from 'gsap';
import firebase from 'firebase';
import ReactFireMixin from 'reactfire';
import toTitleCase from 'titlecase';
// History from: https://github.com/mjackson/history/blob/master/docs/BasenameSupport.md

// Firebase config settings
var config = {
  apiKey: "",
  // Only needed if using Firebase Realtime Database (which we will be in this web app)
  databaseURL: "<insert firebase database URL here>",
  // Only needed if using Firebase Authentication
  authDomain: "",
  // Only needed if using Firebase Storage
  storageBucket: ""
};

firebase.initializeApp(config);

// constants used to set the web app at the sub-directory of /dataexplorer
const LOADER_URL = "/dataexplorer/img/loader.gif"
const history = useBasename(createHistory)({
  basename: '/dataexplorer'
})

// Components (these should probably be refactored into separate .jsx files)
// ---------------------------------------------

var Loader = React.createClass({
  render: function() {
    return (
      <div className="loader text-center">
        <img src={LOADER_URL}/>
      </div>
    );
  }
});

var MainLayout = React.createClass({
  render: function() {
    return (
      <div className="app">

        <nav className="row">
          <div className="col-md-6">
            <ol className="btn-group" role="group" aria-label="Menu">
              <li>
                <Link to="/">
                  <span className="glyphicon glyphicon-home" aria-hidden="true"></span>
                    <span className="sr-only">Home</span>
                </Link>
              </li>
              <li><Link to="/list">Browse by Category</Link></li>
            </ol>
          </div>
        </nav>
        <hr/>
        <section className="row">
          {this.props.children}
        </section>
      </div>
      )
  }
})

var Home = React.createClass({
  getInitialState: function() {
    return {
      show: "hide"
    }
  },
  componentWillMount: function() {

  },
  componentDidMount: function() {
      this.setState({
        show: "show"
      });
      var node = ReactDOM.findDOMNode(this);
      TweenMax.fromTo(node, 0.5, {opacity:0}, {opacity:1});
  },
  render: function() {
    return (
      <div className={` ${this.state.show} `}>
        <div className="col-md-12">
          <h3>
            What moving image moves you?
          </h3>
          <p>
            <Link to={`/list/genre/animation`}>
              Animation
            </Link>?
            { " " }
            <Link to={`/list/form/feature_films`}>
              Feature films
            </Link>?
            { " " }
            <Link to={`/list/form/short_films`}>
              Shorts
            </Link>?
            { " " }
            <Link to={`/list/genre/amateur_student_films`}>
              Student works
            </Link>?
          </p>
          <p>
            Or are you fascinated by a particular subject, say… <Link to={`/list/subject_group/history_castles`}>castles</Link>, 
            <Link to={`/list/subject_group/crafts_visual_arts_painting`}> painting</Link>, 
            <Link to={`/list/subject_group/music_performing_arts_jazz_music`}> jazz</Link>, 
            <Link to={`/list/subject_group/literature_literature`}> literature</Link> or 
            <Link to={`/list/subject_group/crafts_visual_arts_fashion`}> fashion</Link>?
            An almost limitless range of topics can be explored – see what you can find (and yes, 
            we have films on <Link to={`/list/subject_group/crafts_visual_arts_glass_craft`}>glass blowing</Link>,
            <Link to={`/list/subject_group/animals_wildlife_cats`}> cats</Link>,
            <Link to={`/list/subject_group/climate_environment_natural_resources_disasters_fire_control`}> fire control </Link>
            and 
            <Link to={`/list/subject_group/food_health_lifestyle_medicine_psychology_safety_mental_health`}> mental health</Link>, 
            in case you were wondering). After something more…
            how about <Link to={`/list/subject_group/magic_occult_supernatural_magic`}>magic</Link>,
            <Link to={`/list/subject_group/agriculture_business_commerce_industry_permaculture`}> permaculture</Link>, 
            <Link to={`/list/subject_group/family_gender_identity_relationships_sexuality_masochism`}> masochism</Link>,
            <Link to={`/list/subject_group/animals_wildlife_horses`}> horses</Link>,
            <Link to={`/list/subject_group/economics_philosophy_politics_religion_sociology_dystopias`}> dystopias</Link>,
            <Link to={`/list/subject_group/economics_philosophy_politics_religion_sociology_buddhism`}> Buddhism</Link>,
            <Link to={`/list/subject_group/hobbies_recreation_sport_australian_football`}> football</Link>,
            <Link to={`/list/subject_group/food_health_lifestyle_medicine_psychology_safety_dreams`}> dreams</Link>,
            or <Link to={`/list/subject_group/mathematics_science_technology_unidentified_flying_objects`}>UFOs</Link>.
          </p>
          <p>
            This browser provides experimental access to what used to be ACMI’s lending collection. 
            It contains roughly 38,000 items dating back to the 1890s across a wide range of styles – 
            feature films, shorts, documentaries, student works, instructional and experimental films. 
            These works are available to view for free inside the museum’s <a href="https://www.acmi.net.au/exhibitions/australian-mediatheque/" target="_blank">Australian Mediatheque</a>.
          </p>
          <p>
            Future releases will include other parts of our larger collection of over 180,000 items.
          </p>
          <p>
            We’d love to hear from you about what you’ve discovered. <a href="https://www.acmi.net.au/about-us/contact-us/" target="_blank">Contact us here</a>.
          </p>
        </div>
      </div>
      )
  }
})

// List SubCategory
// ---------------------------------------------

var ListSubCategory = React.createClass({
  render: function() {
    if (typeof this.props.indexes[this.props.selectedCat] !== 'undefined') {
      console.log("indexes...");
      console.log(this.props.indexes);
      var rows = [];
      for (var item in this.props.indexes[this.props.selectedCat]) {
        if (item != '.key' && item != 'k_')
        {
          rows.push(item);
        }
      }
      console.log(rows);
      return (
        <div>
         <h3>Select a sub-category</h3>
         <div className="list-output">
          { rows.map(function(subCategory, i) {
      return (
          <p key={i}>
            <Link to={`/list/${this.props.indexes[this.props.selectedCat]['.key']}/${subCategory.replace("k_", "")}`}>
              { this.props.indexes[this.props.selectedCat][subCategory].name }
            </Link>
              { " " }
              ( { this.props.indexes[this.props.selectedCat][subCategory].total } )

          </p>
        )}, this)}
          </div>
        </div>
      )
    }
    else {
      return (
        <span>
        </span>
      )
    }
  }
});

// List Overview
// ---------------------------------------------

var ListCategory = React.createClass({
  getInitialState: function() {
    return {
      indexes: [],
      show: "hide",
      selectedCat: ""
    }
  },

  handleClick: function(category, i) {
    this.setState({ selectedCat: i });
    console.log("current state (after click):")
    console.log(this.state)
  },

  componentWillMount: function() {
    var firebaseRef = firebase.database().ref('stats/');
    var ref = firebaseRef.once('value', function(dataSnapshot) {
      var indexes = [];
      dataSnapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
        item['.key'] = childSnapshot.key;
        indexes.push(item);
      }.bind(this));
      this.setState({
        indexes: indexes,
        show: "show"
      });

      if (typeof this.props.params.category !== 'undefined' && !this.state.selectedCat) {
        var catIndex;
        this.state.indexes.map(function(category, i) {
          if (category['.key'] == this.props.params.category) {
            catIndex = i;
          }
        }, this)
        this.setState({
          selectedCat: catIndex
        })
      }

      console.log("current state (inner):")
      console.log(this.state)
    }.bind(this));

  },

  render: function() {
    console.log(this.state.indexes);
    if (this.state.show == "hide") {
      return <Loader/>
    }
    else {   
      // if a category has been passed in as a parameter (via the URL), the use it as the selected category
      // unless someone has already selected a category.
      let selectedCatText;
      if ( (!!this.state.selectedCat || this.state.selectedCat === 0) && typeof this.state.indexes[this.state.selectedCat] !== 'undefined') {
        selectedCatText = `Selected category: ${this.state.indexes[this.state.selectedCat]['.key'].replace(/_/g, " ")}`
      }
      else {
        selectedCatText = "Select a category"
      }
      return (
        <div className="col-md-12">
          <h3>{ selectedCatText }</h3>
          <div className="list-output">
              { this.state.indexes.map(function(category, i) {
                return (
                  <p key={category['.key']}>
                    <span className="fake-link" onClick={this.handleClick.bind(this, category, i)}>
                     { toTitleCase(category['.key'].replace(/_/g, " ")) }
                    </span>
                  </p>
                  )
              }, this)}
          </div>
          <hr/>
          <ListSubCategory indexes={this.state.indexes} selectedCat={this.state.selectedCat} />
        </div>
        )
    }
  }
});

// Object List
// ---------------------------------------------

var ObjectList = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      records: [],
      show: "hide"
    }
  },
  componentDidMount: function() {

  },
  componentWillMount: function() {
    var firebaseRef = firebase.database().ref('indexes/' + this.props.params.category);
    var ref = firebaseRef.child("k_" + this.props.params.subCategory).once('value', function(dataSnapshot) {
      var records = dataSnapshot.val();
      this.setState({
        records: records,
        show: "show"
      });
      var node = ReactDOM.findDOMNode(this)
      TweenMax.fromTo(node, 0.5, {opacity:0}, {opacity:1});
    }.bind(this));

  },
  render: function() {
    console.log("Rendering... check the value.")
    console.log(this.state.records)

    var list, title, container, numTitles, titles
    let category = toTitleCase(this.props.params.category.replace(/_/g, " "))
    let subCategory = this.props.params.subCategory.replace(/_/g, " ")
    if (typeof this.state.records.titles !== 'undefined') {
      title = (
        <span> 
        <Link to={`/list/${this.props.params.category}`}>
        { category }</Link>
        {` / ${this.state.records.name}`}
        </span>
        )
    }
    else {
      title = toTitleCase(category)
    }

    titles = []
    if (typeof this.state.records.titles !== 'undefined') {
      numTitles = this.state.records.titles.length

      titles = this.state.records.titles.slice()
      // thank you to: http://stackoverflow.com/questions/23300682/array-sort-not-working - need to check for undefined
      titles.sort(function(a, b) {
        if ((typeof b.title === 'undefined' && typeof a.title !== 'undefined') || a.title < b.title) {
          return -1;
        }
        if ((typeof a.title === 'undefined' && typeof b.title !== 'undefined') || a.title > b.title) {
          return 1;
        }
        return 0;
      })
    }

    list = <div className={` ${this.state.show}`}>
            <div ref="mainContainer">
              <p>
                Here is a list of 
                { " " }
                <span className="value-emphasised">
                { numTitles }
                </span>
                { " " }
                titles.
              </p>
              <div className="list-output">
                { titles.map(function(record) {
                  return <p key={record.id}><Link to={`/objects/${record.id}`}>{ record.title }</Link></p>
                })}
              </div>
            </div>
          </div>

    if (this.state.show == "hide") {
      container =
        <div className="col-md-12">
          <h3>{title}</h3>
          <Loader/>
        </div>
    }
    else {
      container =
        <div className="col-md-12">
          <h3>{title}</h3>
          { list }
        </div>
    }
    return container
  }
})

// Components within Object Detail View
// ---------------------------------------------

var TitleMetaData = React.createClass({
  render: function() {
    // temp variables for the parts of the object detail text
    var title, place, creators, length, permalink, jsonlink;

    // Check that each of the values exist before creating each chunk.
    // This means that sentences will only exist
    // where there are values for those sentences.

    // set title block
    if (this.props.data.title && this.props.data.form) {
      title = 
        <span>
              <span className="value-emphasised">{ this.props.data.title }</span>
              { " " }
              is one of many
              { " " }
                <Link to={`/list/form/${acmiHelper.toUnderscore(acmiHelper.getFirst(this.props.data.form))}`}>
                  { acmiHelper.getFirst(this.props.data.form) }
                </Link>
              { " " }
              in our collection.
        </span>
    }
    // set place and year block
    if (this.props.data.place_of_production && this.props.data.creation_date) {
      place = 
        <span>
            { " " }
            It was created in
            { " " }
            <Link to={`/list/place_of_production/${acmiHelper.toUnderscore(acmiHelper.getFirst(this.props.data.place_of_production))}`}>
              { acmiHelper.getFirst(this.props.data.place_of_production) } 
            </Link>
            { " " }
            in the year
            { " " }
            <Link to={`/list/creation_date/${acmiHelper.toUnderscore(acmiHelper.getFirst(this.props.data.creation_date))}`}>
              { acmiHelper.getFirst(this.props.data.creation_date) } 
            </Link>
            .
        </span>
    }
    // set creators
    if (this.props.data.creator_contributor_role) {
      console.log("Yes there's a creator");
      console.log(this.props.data.creator_contributor_role);
      var creatorsArray = this.props.data.creator_contributor_role;
      var creatorsLength = this.props.data.creator_contributor_role.length - 1;
      creators = 
        <span>
          { " " }         
          The creators include 
          { " " }
          { creatorsArray.map(function(creator, i) {
            return (
                <span key={i}>
                  <Link to={`/list/creator_contributor_role/${acmiHelper.toUnderscore(creator)}`}>
                    { creator }
                  </Link>
                    { i < creatorsLength ? ", " : null }
                </span>
            )}, this)}
          .
        </span>
    }
    // set length
    if (this.props.data.length && this.props.data.language_keywords) {
      length =
        <span>
          It runs for
          { " " }
          <Link to={`/list/length/${acmiHelper.toUnderscore(acmiHelper.getFirst(this.props.data.length))}`}>
            { acmiHelper.parseLength(acmiHelper.getFirst(this.props.data.length)) }
          </Link>
          { " " }
          minutes and is in
          { " " }
          <Link to={`/list/language_keywords/${acmiHelper.toUnderscore(acmiHelper.getFirst(this.props.data.language_keywords))}`}>
            { acmiHelper.getFirst(this.props.data.language_keywords) }
          </Link>
          .
        </span>
    }
    // set permalink
    if (this.props.data.permalink) {
      permalink = 
        <span>
          See the full <a target="_blank" href={this.props.data.permalink}>record</a> on our Collections site.
        </span>
    }
    // set json link
    if (this.props.data.system_id) {
      // the chunk below computes a URL for the json file splitting the id into groups of three,
      // separated by a slash. This follows how the JSON files are stored in the collection data repo
      var jsonurl = "https://raw.githubusercontent.com/ACMILabs/collection/master/dist/objects"
      var idStr = this.props.data.system_id.toString()
      var newString = ""

      for (var i in idStr) {
        if ( (i % 3) == 0 ) {
          newString += "/"
        }
        newString += idStr[i]
      }
      newString += `/${idStr}.json`
      jsonurl += newString

      jsonlink =
        <span>
          <a href={`${jsonurl}`} target="_blank">Download this object record as JSON</a>.
        </span>
    }

    return (
      <div>
        <p>
          {title}
          {place}
          {creators}
        </p>
        <p>
          {length}
        </p>
        <p className="title-description">
          {this.props.data.description}
        </p>
        <p>
          {permalink} {jsonlink}
        </p>
      </div>
      )
  }
});


// Object Detail view
// ---------------------------------------------

var ObjectDetail = React.createClass({
  mixins: [ReactFireMixin],

  getInitialState: function() {
    return {
      record: {},
      show: "hide"
    }
  },

  componentWillMount: function() {
    console.log("object ID: " + this.props.params.objectID);


    var firebaseRef = firebase.database().ref('objects/' + this.props.params.objectID);
    var ref = firebaseRef.once('value', function(dataSnapshot) {
      var items = dataSnapshot.val();
      this.setState({
        record: items,
        show: "show"
      });
      var node = ReactDOM.findDOMNode(this);
      TweenMax.fromTo(node, 0.5, {opacity:0}, {opacity:1});
      console.log(items);
    }.bind(this));
  },
  render: function() {
    console.log(this.state);
    if (this.state.show == "hide") {
      return <Loader/>
    }
    else {
      return (
        <div className={` ${this.state.show}`}>
          <div className="col-md-12">
            <h3>{ this.state.record.title }</h3>
            <TitleMetaData data={ this.state.record }/>
          </div>
        </div>
        )
    }
  }
})

// Routing and attach the renderer to the DOM!
// ---------------------------------------------

ReactDOM.render((
  <Router history={history}>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
      <Route path="list" component={ListCategory} />
      <Route path="list/:category" component={ListCategory} />
      <Route path="list/:category/:subCategory" component={ObjectList} />
      <Route path="objects/:objectID" component={ObjectDetail} />
    </Route>
  </Router>
), document.getElementById('root'))

