(this["webpackJsonptalen-react"]=this["webpackJsonptalen-react"]||[]).push([[0],{67:function(e,t,a){e.exports=a(83)},76:function(e,t,a){},81:function(e,t,a){},83:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(19),o=a.n(s),l=a(11),c=(a(76),a(16)),i=Object(c.a)({basename:"/talen-react"}),u=a(24),m=a(53),p=a(54),d=a(55),h=a(14),O={loggedIn:!1,user:JSON.parse(localStorage.getItem("user")||"{}"),loggingIn:!1},f={loggedIn:!1,loggingIn:!1,user:{username:"",access_token:""}};var g={words:[[]],labels:[[]],labelset:[],path:"",isAnnotated:!1,suggestions:[],datasetName:"",documentList:[],annotatedDocumentSet:new Set,datasetIDs:[],wordsColor:"black"};var b={type:"",message:""};var v={formState:{username:"",password:""}};var E=Object(u.combineReducers)({authentication:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:O,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"DATA_LOGIN_REQUEST":return Object(h.a)({},e,{loggingIn:!0,user:t.user});case"DATA_LOGIN_SUCCESS":return{loggingIn:!1,loggedIn:!0,user:t.user};case"DATA_LOGIN_FAILURE":case"DATA_LOGOUT":return f;default:return e}},registration:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"DATA_REGISTER_REQUEST":return{registering:!0};case"DATA_REGISTER_SUCCESS":case"DATA_REGISTER_FAILURE":return{};default:return e}},users:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0;return t.type,e},data:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:g,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"GETDATASETS_SUCCESS":return Object(h.a)({},e,{datasetIDs:t.data.datasetIDs,documentList:[],datasetName:"",annotatedDocumentSet:new Set});case"GETDOCS_SUCCESS":return Object(h.a)({},e,{datasetName:t.data.datasetID,documentList:t.data.documentIDs,annotatedDocumentSet:t.data.annotatedDocumentIDs});case"LOADDOC_SUCCESS":return Object(h.a)({},e,{words:t.data.sentences,labels:t.data.labels,labelset:t.data.labelset,path:t.data.path,isAnnotated:t.data.isAnnotated,suggestions:t.data.suggestions,wordsColor:"black"});case"CLEARDOC":return Object(h.a)({},e,{wordsColor:"silver"});case"SETLABELS":return Object(h.a)({},e,{labels:t.newLabels});default:return e}},alert:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:b,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"ALERT_SUCCESS":return{type:"alert-success",message:t.message};case"ALERT_ERROR":return{type:"alert-danger",message:t.message};case"ALERT_CLEAR":return{type:"",message:""};default:return e}},util:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:v,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"CHANGE_FORM":return{formState:Object(h.a)({},e.formState,{},t.newState)};default:return e}}}),y=Object(d.createLogger)(),S=Object(u.createStore)(E,Object(m.composeWithDevTools)(Object(u.applyMiddleware)(p.a,y)));function k(){var e=JSON.parse(localStorage.getItem("user")||"");return e&&e.access_token?{Authorization:"JWT "+e.access_token}:{}}var w={dataset1:{doc1:{sentences:["Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),"New York City is in New York , which is in the United States .".split(" "),"Other states in the United States include Montana , Indiana , and New Jersey .".split(" "),"England draw dull Denmark game .".split(" ")],labels:["OOOOOOOOOOO".split(""),"OOOOOOOOOOOOOOO".split(""),"OOOOOOOOOOOOOOO".split(""),"OOOOOO".split("")]},doc2:{sentences:["Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),"New York City is in New York , which is in the United States .".split(" "),"England draw dull Denmark game .".split(" ")],labels:["OOOOOOOOOOO".split(""),"OOOOOOOOOOOOOOO".split(""),"OOOOOO".split("")]}},news_set:{news1:{sentences:["Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),"New York City is in New York , which is in the United States .".split(" "),"England draw dull Denmark game .".split(" ")],labels:["OOOOOOOOOOO".split(""),"OOOOOOOOOOOOOOO".split(""),"OOOOOO".split("")]},news2:{sentences:["Johnny Depp stayed at the Paris Hilton , reports CNN .".split(" "),"New York City is in New York , which is in the United States .".split(" "),"England draw dull Denmark game .".split(" ")],labels:["OOOOOOOOOOO".split(""),"OOOOOOOOOOOOOOO".split(""),"OOOOOO".split("")]}}};var j=a(6),D=a(7),N=a(9),C=a(8),_=a(10),T=a(12),A={success:function(e){return{type:"ALERT_SUCCESS",message:e}},error:function(e){return{type:"ALERT_ERROR",message:e}},clear:function(){return{type:"ALERT_CLEAR"}}};var L={login:function(e,t){var a={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({username:e,password:t})};return fetch("http://localhost:5000/users/authenticate",a).then(R).then((function(e){return console.log(e),localStorage.setItem("user",JSON.stringify(e)),e}))},logout:I,register:function(e){var t={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)};return fetch("http://localhost:5000/users/register",t).then(R)},getAll:function(){var e={method:"GET",headers:k()};return fetch("http://localhost:5000/users",e).then(R)},getById:function(e){var t={method:"GET",headers:k()};return fetch("http://localhost:5000/users/".concat(e),t).then(R)},update:function(e){var t={method:"PUT",headers:Object(h.a)({},k(),{"Content-Type":"application/json"}),body:JSON.stringify(e)};return fetch("http://localhost:5000/users/".concat(e.id),t).then(R)},delete:function(e){var t={method:"DELETE",headers:k()};return fetch("http://localhost:5000/users/".concat(e),t).then(R)}};function I(){localStorage.removeItem("user")}function R(e){return e.text().then((function(t){var a=t&&JSON.parse(t);if(!e.ok){401===e.status&&I();var n=a&&a.message||e.statusText;return Promise.reject(n)}return a}))}var x={getDatasets:function(){var e={method:"GET",headers:k()};return fetch("http://localhost:5000/datasetlist",e).then(U).then((function(e){return e}))},saveDocument:function(e){console.log("in service"),console.log(e);var t={headers:Object(h.a)({},k(),{"Content-Type":"application/json"}),body:JSON.stringify(e),method:"POST"};return fetch("http://localhost:5000/savedoc",t).then(U).then((function(e){return e}))},loadDocument:function(e,t){var a={headers:k(),method:"GET"};return fetch("http://localhost:5000/loaddoc?docid=".concat(t,"&dataset=").concat(e),a).then(U).then((function(e){return e}))},getDocuments:function(e){var t={method:"GET",headers:k()};return fetch("http://localhost:5000/loaddataset?dataset=".concat(e),t).then(U).then((function(e){return e}))}};function U(e){return e.text().then((function(t){var a=t&&JSON.parse(t);if(!e.ok){console.log("there is error!");var n=a&&a.message||e.statusText;return Promise.reject(n)}return a}))}var P={login:function(e,t){return function(a){a({type:"DATA_LOGIN_REQUEST",user:{username:e,access_token:"?"}}),L.login(e,t).then((function(e){a(function(e){return{type:"DATA_LOGIN_SUCCESS",user:e}}(e)),console.log("/talen-react/"),i.push("/talen-react/")}),(function(e){a(function(e){return{type:"DATA_LOGIN_FAILURE",error:e}}(e.toString())),a(A.error(e.toString()))}))}},logout:function(){return function(e){L.logout(),e({type:"DATA_LOGOUT"})}},register:function(e){return function(t){t(function(e){return{type:"DATA_REGISTER_REQUEST",user:e}}(e)),L.register(e).then((function(e){t(function(e){return{type:"DATA_REGISTER_SUCCESS",user:e}}(e)),i.push("/talen-react/login"),t(A.success("Registration successful"))}),(function(e){t(function(e){return{type:"DATA_REGISTER_FAILURE",error:e}}(e.toString())),t(A.error(e.toString()))}))}}};var G={getDatasets:function(){return function(e){x.getDatasets().then((function(t){e(function(e){return{type:"GETDATASETS_SUCCESS",data:e}}(t))}),(function(t){F(e,t)}))}},saveDocument:function(e){return function(t){x.saveDocument(e).then((function(e){t(function(e){return{type:"SAVEDOC_SUCCESS",data:e}}(e))}),(function(e){F(t,e)}))}},loadDocument:function(e,t){return function(a){x.loadDocument(e,t).then((function(e){console.log(e),a(function(e){return{type:"LOADDOC_SUCCESS",data:e}}(e))}),(function(e){F(a,e)}))}},getDocuments:function(e){return function(t){x.getDocuments(e).then((function(e){t(function(e){return{type:"GETDOCS_SUCCESS",data:e}}(e))}),(function(e){F(t,e)}))}},loadStatus:function(e,t){return function(a){x.getDocuments(e).then((function(e){a(function(e){return{type:"LOADSTATUS",data:e,docId:t}}(e))}),(function(e){F(a,e)}))}},setLabels:function(e){return{type:"SETLABELS",newLabels:e}},clearDocument:function(){return{type:"CLEARDOC"}}};function F(e,t){"UNAUTHORIZED"===t?(e(A.error("Logged out! Redirecting to login page...")),setTimeout((function(){i.push("/talen-react/login")}),500)):e(A.error(t.toString()))}var M=function(e){return console.log("inside login/changeForm"),{type:"CHANGE_FORM",newState:e}},J=a(56),B=function(e){var t=e.component,a=Object(J.a)(e,["component"]);return r.a.createElement(T.b,Object.assign({},a,{render:function(e){return localStorage.getItem("user")?r.a.createElement(t,e):r.a.createElement(T.a,{to:{pathname:"/login",state:{from:e.location}}})}}))},H=a(95),Y=a(88),W=a(15),q=function(e){function t(){return Object(j.a)(this,t),Object(N.a)(this,Object(C.a)(t).apply(this,arguments))}return Object(_.a)(t,e),Object(D.a)(t,[{key:"render",value:function(){var e=this.props.match.params.docid,t=this.props.match.params.id;return r.a.createElement("div",null,r.a.createElement(H.a,{bg:"light",expand:"lg",fixed:"top"},r.a.createElement(Y.a,null,r.a.createElement(H.a.Brand,{href:"/talen-react"},r.a.createElement("img",{alt:"",src:"".concat("/talen-react","/logo-black-trans.png"),height:"30",className:"d-inline-block align-top"})),r.a.createElement(H.a.Toggle,{"aria-controls":"basic-navbar-nav"}),r.a.createElement(H.a.Collapse,{id:"basic-navbar-nav"},r.a.createElement(H.a.Collapse,{className:"mr-auto"},r.a.createElement(H.a.Text,{className:"px-2"},r.a.createElement(W.a,{to:"/"},"Home")),t&&r.a.createElement(H.a.Text,{className:"px-1"},">"),r.a.createElement(H.a.Text,{className:"px-2"},r.a.createElement(W.a,{to:"/dataset/".concat(t)},t)),e&&r.a.createElement(H.a.Text,{className:"px-1"},">"),r.a.createElement(H.a.Text,{className:"px-2"},e)),this.props.hideLoginButton?null:r.a.createElement(r.a.Fragment,null,r.a.createElement(H.a.Collapse,{className:"justify-content-end"},this.props.userName?r.a.createElement(r.a.Fragment,null,r.a.createElement(H.a.Text,{className:"px-3"},"Signed in as: ".concat(this.props.userName)),r.a.createElement(W.a,{to:"/login"},"Logout")):r.a.createElement(H.a.Text,null,r.a.createElement(W.a,{to:"/login"},"Login"))))))),r.a.createElement(Y.a,null,this.props.children))}}]),t}(r.a.Component),Q=Object(T.g)(Object(l.b)((function(e){return{userName:e.authentication.user.username}}),(function(e){return{}}))(q)),z=a(29),V=a(20),K=a(94),Z=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this,e))).changeInput=a.changeInput.bind(Object(V.a)(a)),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"changeInput",value:function(e){var t=e.target.value,a=e.target.name;this.props.handleChange(Object(z.a)({},a,t))}},{key:"render",value:function(){var e=this.props,t=e.label,a=e.type,n=e.name,s=e.model,o=e.formState[s];return r.a.createElement(K.a.Group,null,r.a.createElement(K.a.Label,null,t),r.a.createElement(K.a.Control,{type:a,name:n,defaultValue:o,onChange:this.changeInput}))}}]),t}(r.a.Component),X=Object(l.b)((function(e){return{formState:e.util.formState}}),(function(e){return{handleChange:function(t){return e(M(t))}}}))(Z),$=a(96),ee=a(89),te=function(e){function t(){return Object(j.a)(this,t),Object(N.a)(this,Object(C.a)(t).apply(this,arguments))}return Object(_.a)(t,e),Object(D.a)(t,[{key:"componentDidMount",value:function(){var e=this.props,t=e.data,a=e.match;0===t.documentList.length&&this.props.getDocuments(a.params.id),t.words.length>0&&this.props.clearDocument()}},{key:"render",value:function(){var e=this.props,t=e.match,a=e.data;return console.log(t.params.id),console.log(a),r.a.createElement(Q,null,r.a.createElement("div",{className:"col-md-12"},a&&a.documentList&&a.annotatedDocumentSet&&r.a.createElement("p",null,"There are ",a.documentList.length," documents. Of these,"," ",a.annotatedDocumentSet.length," have been annotated (marked in green)."),r.a.createElement($.a,null,a&&a.documentList&&a.documentList.map((function(e,n){return r.a.createElement($.a.Item,{key:n,variant:a.annotatedDocumentSet.indexOf(e)>-1?"success":void 0},r.a.createElement(ee.a,{className:"sentence-badge",key:"badge-"+n,variant:a.annotatedDocumentSet.indexOf(e)>-1?"success":"light"},n+1),r.a.createElement(W.a,{to:{pathname:"/dataset/".concat(t.params.id,"/").concat(e)}},e))})))))}}]),t}(r.a.Component);var ae={getDocuments:G.getDocuments,clearDocument:G.clearDocument},ne=Object(l.b)((function(e){var t=e.authentication,a=e.data;return{user:t.user,data:a}}),ae)(te),re=a(61),se=a(90),oe=a(58),le=a(98),ce=a(100),ie=a(91),ue=a(92),me=a(97),pe=a(99),de=function(e){function t(){return Object(j.a)(this,t),Object(N.a)(this,Object(C.a)(t).apply(this,arguments))}return Object(_.a)(t,e),Object(D.a)(t,[{key:"render",value:function(){var e=this;return r.a.createElement(ce.a,{onClick:function(){return e.props.onClick()},bsPrefix:"custom-btn",className:["label-button",this.props.label].join(" "),style:{background:this.props.color}},this.props.label)}}]),t}(r.a.Component),he=function(e){function t(){var e,a;Object(j.a)(this,t);for(var n=arguments.length,s=new Array(n),o=0;o<n;o++)s[o]=arguments[o];return(a=Object(N.a)(this,(e=Object(C.a)(t)).call.apply(e,[this].concat(s)))).myRef=r.a.createRef(),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"handleOver",value:function(e){1===e.buttons&&this.props.mouseup()}},{key:"componentDidMount",value:function(){document.addEventListener("contextmenu",this._handleContextMenu)}},{key:"_handleContextMenu",value:function(e){e.preventDefault()}},{key:"handleDown",value:function(e){2===e.button&&console.log("right click down"),e.target.classList.contains("token")&&this.props.mousedown()}},{key:"handleUp",value:function(e){if(2===e.button)return console.log("right click up"),void this.props.set_label("O");this.props.mouseup()}},{key:"render",value:function(){var e=this,t=this.props.label.split("-").pop()||"O",a=Object.keys(this.props.labelset).sort(),n=a.indexOf("O");a.splice(n,1),a.push("O");var s=a.map((function(t){return r.a.createElement(de,{key:t,label:t,color:e.props.labelset[t],onClick:function(){return e.props.set_label(t)}})})),o=["spacer","nocopy"],l={background:"transparent"};"O"!==this.props.label&&this.props.next_token_is_entity&&(l.background=this.props.labelset[t],o.push("label")),"highlightstart"!==this.props.selected&&"highlighted"!==this.props.selected||o.push("highlighted");var c=["token","nocopy",this.props.selected,t,"O"===this.props.label?null:"label"];return this.props.next_token_is_entity||"B"!==this.props.label[0]?"B"===this.props.label[0]?c.push("labelstart"):"O"===this.props.label||this.props.next_token_is_entity||c.push("labelend"):c.push("labelsingle"),r.a.createElement(r.a.Fragment,null,r.a.createElement("span",{className:c.join(" "),onMouseDown:function(t){return e.handleDown(t)},onMouseUp:function(t){return e.handleUp(t)},onMouseOver:function(t){return e.handleOver(t)},style:{background:this.props.labelset[t],color:this.props.wordsColor},ref:this.myRef},this.props.form),r.a.createElement("span",{className:o.join(" "),style:l}," "),r.a.createElement(me.a,{show:this.props.show_popover,target:this.myRef.current,placement:"bottom",transition:!1},r.a.createElement(pe.a,{id:"popover-container"},r.a.createElement(pe.a.Title,null,this.props.display_phrase," ",r.a.createElement("a",{href:"https://www.google.com/search?q=".concat(this.props.display_phrase),target:"_blank",rel:"noopener noreferrer"},"(Google)")),r.a.createElement(pe.a.Content,null,r.a.createElement("div",{className:"label-box"},s)))))}}]),t}(r.a.Component);var Oe=Object(l.b)((function(e){return{wordsColor:e.data.wordsColor}}),{})(he),fe=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this,e))).state={color:"white",words:[[]],labels:[[]],path:"",mouseIsDown:!1,selected_range:[-1,-1],popover_index:-1,prevDoc:"",nextDoc:"",status:""},a.rowMouseDown=a.rowMouseDown.bind(Object(V.a)(a)),a.rowMouseUp=a.rowMouseUp.bind(Object(V.a)(a)),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"showPopoverFunc",value:function(e){return this.props.isActive&&!this.state.mouseIsDown&&e===this.state.selected_range[1]}},{key:"updateRange",value:function(e,t){this.setState({selected_range:[e,t]})}},{key:"tokenUp",value:function(e){this.updateRange(this.state.selected_range[0],e)}},{key:"tokenDown",value:function(e){this.updateRange(e,e)}},{key:"rowMouseDown",value:function(e){this.props.setFocus(this.props.index)}},{key:"rowMouseUp",value:function(e){"A"!==e.target.tagName&&this.checkClearRange(e)}},{key:"checkClearRange",value:function(e){var t=e.target;t.classList.contains("token")||t.classList.contains("label-button")||this.updateRange(-1,-1)}},{key:"selected_keyword",value:function(e){var t=this.state.selected_range[0],a=this.state.selected_range[this.state.selected_range.length-1];if(!this.props.isActive)return"";if(t>a){var n=a;a=t,t=n}return t===a&&t===e?"highlightsingle":e===t?"highlightstart":e===a?"highlightend":e>t&&e<a?"highlighted":""}},{key:"render",value:function(){var e=this,t=this.props.sent.slice(this.state.selected_range[0],this.state.selected_range[1]+1).join(" ");return r.a.createElement("div",{className:"sentence",onMouseDown:this.rowMouseDown,onMouseUp:this.rowMouseUp},r.a.createElement(ee.a,{className:"sentence-badge",key:"badge-"+this.props.index,variant:"light"},this.props.index),this.props.sent.map((function(a,n){return r.a.createElement(Oe,{key:n,form:a,label:e.props.labels[n],labelset:e.props.labelset,next_token_is_entity:n!==e.props.sent.length-1&&"I"===e.props.labels[n+1][0],selected:e.selected_keyword(n),mousedown:function(){return e.tokenDown(n)},mouseup:function(){return e.tokenUp(n)},show_popover:e.showPopoverFunc(n),display_phrase:t,set_label:function(t){return e.props.set_label(t,e.state.selected_range[0],e.state.selected_range[1])}})})))}}]),t}(r.a.Component),ge=a(34),be=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this,e))).state={activeSent:-1,isSaved:!0,propagate:!0},a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"componentDidMount",value:function(){this.loadAll(this.props.dataset,this.props.docid)}},{key:"find_csa",value:function(e,t,a){var n=a>>>0,r=t.length,s=e.length+1-r,o=[];e:for(;n<s;n++){for(var l=0;l<r;l++)if(e[n+l].toLowerCase()!==t[l].toLowerCase())continue e;o.push(n)}return o}},{key:"setLabel",value:function(e,t,a,n){var r=this;if(this.setState({isSaved:!1}),t>a){var s=a;a=t,t=s}var o=this.props.data.words[n].slice(t,a+1),l=[];if(this.state.propagate)for(var c=function(e){r.find_csa(r.props.data.words[e],o,0).forEach((function(t){return l.push([e,t,t+o.length-1])}))},i=0;i<this.props.data.words.length;i++){c(i)}else l.push([n,t,a]);var u=Object(re.cloneDeep)(this.props.data.labels);l.forEach((function(t){var a=t[0],n=t[1],s=t[2];if("I"!==r.props.data.labels[a][n][0]||"O"===e)for(var o=n;o<=s;o++){var l="";if("O"!==e)l=o===n?"B-":"I-";else{var c=u[a][o+1];c&&c.startsWith("I-")&&(u[a][o+1]="B-"+c.split("-").pop())}u[a][o]=l+e}})),this.props.setLabels(u),this.setState({activeSent:-1})}},{key:"sendLabels",value:function(){this.setState({isSaved:!0});var e={docid:this.props.docid,dataset:this.props.dataset,sentences:this.props.data.words,labels:this.props.data.labels,path:this.props.data.path};this.props.saveDocument(e),this.props.data.isAnnotated=!0}},{key:"setFocus",value:function(e){console.log("sentence ".concat(e," wants focus now!")),this.setState({activeSent:e})}},{key:"loadAll",value:function(e,t){this.props.loadDocument(e,t)}},{key:"buttonPush",value:function(e,t){for(var a=this.props.data.labels,n=!1,r=0;r<a.length;r++)for(var s=a[r],o=0;o<s.length;o++){if("O"!==s[o]){n=!0;break}}var l=!0;if(n&&!this.state.isSaved&&(l=window.confirm("There are unsaved labels! Press OK to discard labels, and cancel to stay on this page.")),l){this.props.clearDocument();var c="/dataset/".concat(e,"/").concat(t);this.loadAll(e,t),i.push("/talen-react"+c)}}},{key:"render",value:function(){var e=this,t=this.props,a=t.data,n=t.docid,s=a.documentList.indexOf(n),o=a.documentList[s+1],l=a.documentList[s-1];return r.a.createElement(se.a,{className:"document"},r.a.createElement(oe.a,{md:9},r.a.createElement(le.a,null,r.a.createElement(le.a.Body,null,a.words&&a.labelset&&a.words.map((function(t,n){return r.a.createElement(fe,{key:n,index:n,sent:t,labels:a.labels[n],labelset:a.labelset,setFocus:function(t){return e.setFocus(t)},isActive:n===e.state.activeSent,set_label:function(t,a,r){return e.setLabel(t,a,r,n)}})}))))),r.a.createElement(oe.a,{md:3},this.state.isSaved&&a.isAnnotated&&r.a.createElement(ce.a,{variant:"outline-success"},r.a.createElement(r.a.Fragment,null,r.a.createElement(ge.d,null)," Saved")),(!this.state.isSaved||!a.isAnnotated)&&r.a.createElement(ce.a,{variant:"outline-danger",onClick:function(){return e.sendLabels()}},r.a.createElement(r.a.Fragment,null,r.a.createElement(ge.c,null)," Save")),r.a.createElement("p",null),r.a.createElement("p",null,"On document ".concat(s+1," out of ").concat(a.documentList.length)),r.a.createElement("p",null),r.a.createElement(K.a,null,r.a.createElement("div",{className:"mb-3"},r.a.createElement(K.a.Check,{onChange:function(t){return e.setState({propagate:t.target.checked})},defaultChecked:this.state.propagate,id:"propagation-checkbox",type:"checkbox",label:"Propagate annotations?"}))),r.a.createElement("p",null),r.a.createElement(ie.a,null,l&&r.a.createElement(ce.a,{variant:"outline-primary",onClick:function(){return e.buttonPush(e.props.dataset,l)}},r.a.createElement(ge.a,null)," Previous"),o&&r.a.createElement(ce.a,{variant:"outline-primary",onClick:function(){return e.buttonPush(e.props.dataset,o)}},"Next ",r.a.createElement(ge.b,null))),r.a.createElement("p",null),r.a.createElement(ie.a,null,r.a.createElement(W.a,{to:"".concat(this.props.uplink)},r.a.createElement(ce.a,{variant:"outline-secondary"},"Back to all docs..."))),r.a.createElement("p",null),r.a.createElement(ue.a,{striped:!0,bordered:!0,hover:!0,size:"sm"},r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Phrase"),r.a.createElement("th",null,"Num Occur."))),r.a.createElement("tbody",null,Object.keys(a.suggestions).map((function(e){return r.a.createElement("tr",{key:e},r.a.createElement("td",null,e),r.a.createElement("td",null,a.suggestions[e].length))}))))))}}]),t}(r.a.Component);var ve={saveDocument:G.saveDocument,loadDocument:G.loadDocument,loadStatus:G.loadStatus,setLabels:G.setLabels,clearDocument:G.clearDocument},Ee=Object(l.b)((function(e){return{data:e.data}}),ve)(Object(T.g)(be)),ye=function(e){function t(){return Object(j.a)(this,t),Object(N.a)(this,Object(C.a)(t).apply(this,arguments))}return Object(_.a)(t,e),Object(D.a)(t,[{key:"render",value:function(){var e=this.props.match;return r.a.createElement(Q,null,r.a.createElement("div",{className:"col-md-12"},r.a.createElement(Ee,{dataset:e.params.id,docid:e.params.docid,uplink:"/dataset/".concat(e.params.id)})),r.a.createElement("div",{style:{height:150}}))}}]),t}(r.a.Component);var Se=Object(l.b)((function(e){var t=e.authentication,a=e.data;return{user:t.user,data:a}}),{})(ye),ke=a(93),we=function(e){function t(){return Object(j.a)(this,t),Object(N.a)(this,Object(C.a)(t).apply(this,arguments))}return Object(_.a)(t,e),Object(D.a)(t,[{key:"componentDidMount",value:function(){this.props.getDatasets()}},{key:"render",value:function(){var e=this.props,t=e.user,a=e.data;return r.a.createElement(Q,null,r.a.createElement("div",{className:"col-md-12"},r.a.createElement(ke.a,null,r.a.createElement("h1",null,"Hello, ",t.username,"!"),r.a.createElement("p",null,"Welcome to TALEN. Choose a dataset below to get started annotating!")),r.a.createElement("h3",null,"Dataset List:"),r.a.createElement($.a,null,a&&a.datasetIDs&&a.datasetIDs.map((function(e,t){return r.a.createElement($.a.Item,{key:t},r.a.createElement(W.a,{to:"/dataset/".concat(e)},e))})))))}}]),t}(r.a.Component);var je={getDatasets:G.getDatasets},De=Object(l.b)((function(e){var t=e.authentication,a=e.data;return{user:t.user,data:a}}),je)(we),Ne=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this,e))).props.logout(),a.handleSubmit=a.handleSubmit.bind(Object(V.a)(a)),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"handleSubmit",value:function(e){e.preventDefault();var t=this.props,a=t.formState;(0,t.login)(a.username,a.password)}},{key:"render",value:function(){var e=null;return e=r.a.createElement("p",null,"In the demo, you can log in with anything (empty/empty)."),r.a.createElement(Q,{hideLoginButton:!0},r.a.createElement("div",{className:"col-md-6 col-md-offset-3"},r.a.createElement("h2",null,"Login"),e,r.a.createElement("form",{name:"form",onSubmit:this.handleSubmit},r.a.createElement(X,{name:"username",label:"Username",type:"text",model:"username"}),r.a.createElement(X,{name:"password",label:"Password",type:"password",model:"password"}),r.a.createElement("div",{className:"form-group"},r.a.createElement("button",{className:"btn btn-primary"},"Login")))))}}]),t}(r.a.Component);var Ce={login:P.login,logout:P.logout},_e=Object(l.b)((function(e){return{loggingIn:e.authentication.loggingIn,formState:e.util.formState}}),Ce)(Ne),Te=function(e){function t(e){var a;return Object(j.a)(this,t),(a=Object(N.a)(this,Object(C.a)(t).call(this,e))).state={user:{firstName:"",lastName:"",username:"",password:""},submitted:!1},a.handleChange=a.handleChange.bind(Object(V.a)(a)),a.handleSubmit=a.handleSubmit.bind(Object(V.a)(a)),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"handleChange",value:function(e){var t=e.target,a=t.name,n=t.value,r=this.state.user;this.setState({user:Object(h.a)({},r,Object(z.a)({},a,n))})}},{key:"handleSubmit",value:function(e){e.preventDefault(),this.setState({submitted:!0});var t=this.state.user;t.firstName&&t.lastName&&t.username&&t.password&&this.props.register(t)}},{key:"render",value:function(){var e=this.state,t=e.user,a=e.submitted;return r.a.createElement("div",{className:"col-md-6 col-md-offset-3"},r.a.createElement("h2",null,"Register"),r.a.createElement("form",{name:"form",onSubmit:this.handleSubmit},r.a.createElement("div",{className:"form-group"+(a&&!t.firstName?" has-error":"")},r.a.createElement("label",{htmlFor:"firstName"},"First Name"),r.a.createElement("input",{type:"text",className:"form-control",name:"firstName",value:t.firstName,onChange:this.handleChange}),a&&!t.firstName&&r.a.createElement("div",{className:"help-block"},"First Name is required")),r.a.createElement("div",{className:"form-group"+(a&&!t.lastName?" has-error":"")},r.a.createElement("label",{htmlFor:"lastName"},"Last Name"),r.a.createElement("input",{type:"text",className:"form-control",name:"lastName",value:t.lastName,onChange:this.handleChange}),a&&!t.lastName&&r.a.createElement("div",{className:"help-block"},"Last Name is required")),r.a.createElement("div",{className:"form-group"+(a&&!t.username?" has-error":"")},r.a.createElement("label",{htmlFor:"username"},"Username"),r.a.createElement("input",{type:"text",className:"form-control",name:"username",value:t.username,onChange:this.handleChange}),a&&!t.username&&r.a.createElement("div",{className:"help-block"},"Username is required")),r.a.createElement("div",{className:"form-group"+(a&&!t.password?" has-error":"")},r.a.createElement("label",{htmlFor:"password"},"Password"),r.a.createElement("input",{type:"password",className:"form-control",name:"password",value:t.password,onChange:this.handleChange}),a&&!t.password&&r.a.createElement("div",{className:"help-block"},"Password is required")),r.a.createElement("div",{className:"form-group"},r.a.createElement("button",{className:"btn btn-primary"},"Register"),r.a.createElement(W.a,{to:"/login",className:"btn btn-link"},"Cancel"))))}}]),t}(r.a.Component);var Ae={register:P.register},Le=(Object(l.b)((function(e){return{registering:e.registration.registering}}),Ae)(Te),a(81),function(e){function t(e){var a;return Object(j.a)(this,t),a=Object(N.a)(this,Object(C.a)(t).call(this,e)),i.listen((function(e,t){a.props.clearAlerts()})),a}return Object(_.a)(t,e),Object(D.a)(t,[{key:"render",value:function(){var e=this.props.alert;return r.a.createElement(T.c,{history:i},e.message&&r.a.createElement("div",{className:"alert ".concat(e.type)},e.message),r.a.createElement(T.d,null,r.a.createElement(B,{exact:!0,path:"/",component:De}),r.a.createElement(B,{exact:!0,path:"/dataset/:id",component:ne}),r.a.createElement(B,{exact:!0,path:"/dataset/:id/:docid",component:Se}),r.a.createElement(T.b,{path:"/login",component:_e}),r.a.createElement(T.a,{from:"*",to:"/"})))}}]),t}(r.a.Component));var Ie={clearAlerts:A.clear},Re=Object(l.b)((function(e){return{alert:e.alert}}),Ie)(Le);a(82);(function(){var e=window.fetch;window.fetch=function(t,a){return new Promise((function(n,r){setTimeout((function(){if(t.endsWith("/users/authenticate")&&"POST"===a.method){var r={id:0,username:"test_user",firstName:"Test",lastName:"User"};n({ok:!0,text:function(){return Promise.resolve(JSON.stringify(r))}})}else if(t.endsWith("/datasetlist")&&"GET"===a.method){var s={datasetIDs:Object.keys(w)};n({ok:!0,text:function(){return Promise.resolve(JSON.stringify(s))}})}else if(t.indexOf("loaddataset")>-1&&"GET"===a.method){var o=t.split("?"),l=new URLSearchParams(o[o.length-1]).get("dataset"),c={documentIDs:Object.keys(w[l]),annotatedDocumentIDs:[]};n({ok:!0,text:function(){return Promise.resolve(JSON.stringify(c))}})}else{if(t.indexOf("loaddoc")>-1&&"GET"===a.method){var i=t.split("?"),u=new URLSearchParams(i[i.length-1]),m=u.get("dataset"),p=u.get("docid"),d=w[m][p];return d.labelset={PER:"yellow",LOC:"yellowgreen",ORG:"lightblue",O:"transparent"},void n({ok:!0,text:function(){return Promise.resolve(JSON.stringify(d))}})}if(t.indexOf("savedoc")>-1){var h={msg:"Saved correctly."};n({ok:!0,text:function(){return Promise.resolve(JSON.stringify(h))}})}else e(t,a).then((function(e){return n(e)}))}}),10)}))}})(),o.a.render(r.a.createElement(l.a,{store:S},r.a.createElement(Re,null)),document.getElementById("root"))}},[[67,1,2]]]);
//# sourceMappingURL=main.e8053c8a.chunk.js.map