define([
		"esri/map", "esri/InfoTemplate", "esri/layers/FeatureLayer",
        "dojo/parser","dojo/_base/fx", "dojo/on",
        "dojo/dom", "dojo/string", "dijit/Dialog", 
        "dojo/domReady!"
//    "dojo/dom", "dojo/dom-construct", "dojo/dom-attr", "dojo/on", // "dojo/router",
 //   "dojo/_base/array", "dojo/_base/lang", "dojo/query", 
 //   "dojo/store/JsonRest", "dojo/topic", "dojo/_base/fx", "dojox/gfx",
 //    "custom/gridWidget/gridWidget", "custom/photoWidget/photoWidget", "js/util13", "js/module"
],
    function (
        Map, InfoTemplate, FeatureLayer, 
		parser, baseFx, on, 
		dom, string, Dialog
    //	dom, domConstruct, domAttr, on, // router,
    //    arrayUtil, lang, query, 
    //    JsonRest, topic, baseFx, gfx,
    //    GridWidget, PhotoWidget, util  
    ) 
    {
        "use strict";
        var  map, // 
			lods = [	{"level" : 0, "resolution" : 39135.75848200009, "scale" : 147914381.897889}, {"level" : 1, "resolution" : 19567.87924099992, "scale" : 73957190.948944 },
						{"level" : 2, "resolution" : 9783.93962049996,  "scale" : 36978595.474472},  {"level" : 3, "resolution" : 4891.96981024998,  "scale" : 18489297.737236},
						{"level" : 4, "resolution" : 2445.98490512499,  "scale" : 9244648.868618},	{"level" : 5, "resolution" : 1222.99245256249,  "scale" : 4622324.434309} ],

			fade = function(dir,node) {
				if (dir === 'Out') { baseFx.fadeOut({ node: dom.byId(node), duration : 500 }).play(); }
				if (dir === 'In')  { baseFx.fadeIn ({ node: dom.byId(node), duration : 500 }).play(); }
			},
			getInfoWindowCentent = function(graphic) {
				var s, att, fixCo;
				att = graphic.attributes;
				s = "Samples : " + att.samples + "<br>Contact : " + att.usgs + "<br>Collaborator : " + att.collab + "<br>Downloadable files :"; 
				if (att.photos) {
					fixCo = att.cntry_name.replace(' ','_');
					s += "<br>&nbsp;&nbsp;&nbsp;  <a target='_blank' href=countries/" + fixCo + "_Petrography_Photos.zip>Petrography Photos</a>";
				}
				if (att.analysis) {
					fixCo = att.cntry_name.replace(' ','_');
					s += "<br>&nbsp;&nbsp;&nbsp;  <a target='_blank' href=countries/" + fixCo + "_Petrographic_Analyses.xlsx>Petrographic Data Excel Spreadsheet</a>";
				}
				if (att.chemical) {
					fixCo = att.cntry_name.replace(' ','_');
					s += "<br>&nbsp;&nbsp;&nbsp;  <a target='_blank' href=countries/" + fixCo + "_WOCQI_chemical_data.xlsx>Chemical Data Excel Spreadsheet</a>";
				}
				return s;
			},
			doHelp = function() {
				var dialog,s;
				
//				s = "Map is interactive. Highlighted countries have downloadable data.\nPut cursor on sliding map scale button and move it up to zoom in and see country names.\nClick on a highlighted country to see pop-up with links to data.\nPlace cursor on map and drag to change map position.\nClick on Initial Extent button to go back to full map view.\nClick on Collaborators button on the homepage to see list of countries and numbers of samples.";
				s = "<li>Map is interactive. Highlighted countries have downloadable data.</li><li>Use '+' button to zoom in and see country names.</li><li>Click on a highlighted country to see pop-up with links to data.</li><li>Place cursor on map and drag to change map position.</li><li>Click on Collaborators button on the homepage to see list of countries and numbers of samples.</li>";
				
				dialog = new Dialog({
					title: "Help",
					content: s
				});
				dialog.show();
//				alert(s);
			},
			initOperationalLayer = function() {
				var infoTemplate, featureLayer;
				
//				infoTemplate = new InfoTemplate("${cntry_name}", "Samples : ${samples}<br>Contact : ${usgs}<br>Collaborator : ${collab}<br>");
				infoTemplate = new InfoTemplate();
				infoTemplate.setTitle("<b>${cntry_name}</b>");
				infoTemplate.setContent(getInfoWindowCentent);
				
				featureLayer = new FeatureLayer("http://ncrdspublic.er.usgs.gov/ArcGIS/rest/services/wocqi_all_wmas_lim/MapServer/0",{
					mode: FeatureLayer.MODE_ONDEMAND,
					outFields: ["*"],
					infoTemplate: infoTemplate,
					opacity: 0.5
				});
				
				map.addLayer(featureLayer);
				map.infoWindow.resize(350,175);
				on(dom.byId("helpButton"), "click", doHelp);
			},
            startUp = function () {
				map = new Map("mapDiv", { 
					basemap: "topo",
					center: [-5,36 ],
					zoom: 0,
					sliderStyle: "large",
					wrapAround180: false,
					logo: false,
					showAttribution: false,
					lods: lods
				});

				map.on("load", initOperationalLayer);
				map.on("layer-add", function() { 
					console.log("Layer added"); 
					fade('In', 'mapDiv');
				});

			},
			fun1 =  function (shape) {
			//	console.log("fun 1");
			};

        return {
            init: function () {
            	parser.parse();
				startUp();
                return 0;
            }
        };
    }
);
