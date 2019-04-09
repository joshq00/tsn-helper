// ==UserScript==
// @name         MLBTSNTamperSettingsFramework 2019
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.4.8.4
// @description  Reusable pieces for MLBTSN scripts
// @author       sreyemnayr
// @match        https://mlb19.theshownation.com/*

// ==/UserScript==

// Libraries / Dependencies

// md5 implementation from http://www.myersdaily.org/joseph/javascript/md5-text.html
function md5cycle(f,h){var i=f[0],n=f[1],r=f[2],g=f[3];i=ff(i,n,r,g,h[0],7,-680876936),g=ff(g,i,n,r,h[1],12,-389564586),r=ff(r,g,i,n,h[2],17,606105819),n=ff(n,r,g,i,h[3],22,-1044525330),i=ff(i,n,r,g,h[4],7,-176418897),g=ff(g,i,n,r,h[5],12,1200080426),r=ff(r,g,i,n,h[6],17,-1473231341),n=ff(n,r,g,i,h[7],22,-45705983),i=ff(i,n,r,g,h[8],7,1770035416),g=ff(g,i,n,r,h[9],12,-1958414417),r=ff(r,g,i,n,h[10],17,-42063),n=ff(n,r,g,i,h[11],22,-1990404162),i=ff(i,n,r,g,h[12],7,1804603682),g=ff(g,i,n,r,h[13],12,-40341101),r=ff(r,g,i,n,h[14],17,-1502002290),i=gg(i,n=ff(n,r,g,i,h[15],22,1236535329),r,g,h[1],5,-165796510),g=gg(g,i,n,r,h[6],9,-1069501632),r=gg(r,g,i,n,h[11],14,643717713),n=gg(n,r,g,i,h[0],20,-373897302),i=gg(i,n,r,g,h[5],5,-701558691),g=gg(g,i,n,r,h[10],9,38016083),r=gg(r,g,i,n,h[15],14,-660478335),n=gg(n,r,g,i,h[4],20,-405537848),i=gg(i,n,r,g,h[9],5,568446438),g=gg(g,i,n,r,h[14],9,-1019803690),r=gg(r,g,i,n,h[3],14,-187363961),n=gg(n,r,g,i,h[8],20,1163531501),i=gg(i,n,r,g,h[13],5,-1444681467),g=gg(g,i,n,r,h[2],9,-51403784),r=gg(r,g,i,n,h[7],14,1735328473),i=hh(i,n=gg(n,r,g,i,h[12],20,-1926607734),r,g,h[5],4,-378558),g=hh(g,i,n,r,h[8],11,-2022574463),r=hh(r,g,i,n,h[11],16,1839030562),n=hh(n,r,g,i,h[14],23,-35309556),i=hh(i,n,r,g,h[1],4,-1530992060),g=hh(g,i,n,r,h[4],11,1272893353),r=hh(r,g,i,n,h[7],16,-155497632),n=hh(n,r,g,i,h[10],23,-1094730640),i=hh(i,n,r,g,h[13],4,681279174),g=hh(g,i,n,r,h[0],11,-358537222),r=hh(r,g,i,n,h[3],16,-722521979),n=hh(n,r,g,i,h[6],23,76029189),i=hh(i,n,r,g,h[9],4,-640364487),g=hh(g,i,n,r,h[12],11,-421815835),r=hh(r,g,i,n,h[15],16,530742520),i=ii(i,n=hh(n,r,g,i,h[2],23,-995338651),r,g,h[0],6,-198630844),g=ii(g,i,n,r,h[7],10,1126891415),r=ii(r,g,i,n,h[14],15,-1416354905),n=ii(n,r,g,i,h[5],21,-57434055),i=ii(i,n,r,g,h[12],6,1700485571),g=ii(g,i,n,r,h[3],10,-1894986606),r=ii(r,g,i,n,h[10],15,-1051523),n=ii(n,r,g,i,h[1],21,-2054922799),i=ii(i,n,r,g,h[8],6,1873313359),g=ii(g,i,n,r,h[15],10,-30611744),r=ii(r,g,i,n,h[6],15,-1560198380),n=ii(n,r,g,i,h[13],21,1309151649),i=ii(i,n,r,g,h[4],6,-145523070),g=ii(g,i,n,r,h[11],10,-1120210379),r=ii(r,g,i,n,h[2],15,718787259),n=ii(n,r,g,i,h[9],21,-343485551),f[0]=add32(i,f[0]),f[1]=add32(n,f[1]),f[2]=add32(r,f[2]),f[3]=add32(g,f[3])}function cmn(f,h,i,n,r,g){return h=add32(add32(h,f),add32(n,g)),add32(h<<r|h>>>32-r,i)}function ff(f,h,i,n,r,g,t){return cmn(h&i|~h&n,f,h,r,g,t)}function gg(f,h,i,n,r,g,t){return cmn(h&n|i&~n,f,h,r,g,t)}function hh(f,h,i,n,r,g,t){return cmn(h^i^n,f,h,r,g,t)}function ii(f,h,i,n,r,g,t){return cmn(i^(h|~n),f,h,r,g,t)}function md51(f){txt="";var h,i=f.length,n=[1732584193,-271733879,-1732584194,271733878];for(h=64;h<=f.length;h+=64)md5cycle(n,md5blk(f.substring(h-64,h)));f=f.substring(h-64);var r=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(h=0;h<f.length;h++)r[h>>2]|=f.charCodeAt(h)<<(h%4<<3);if(r[h>>2]|=128<<(h%4<<3),h>55)for(md5cycle(n,r),h=0;h<16;h++)r[h]=0;return r[14]=8*i,md5cycle(n,r),n}function md5blk(f){var h,i=[];for(h=0;h<64;h+=4)i[h>>2]=f.charCodeAt(h)+(f.charCodeAt(h+1)<<8)+(f.charCodeAt(h+2)<<16)+(f.charCodeAt(h+3)<<24);return i}var hex_chr="0123456789abcdef".split("");function rhex(f){for(var h="",i=0;i<4;i++)h+=hex_chr[f>>8*i+4&15]+hex_chr[f>>8*i&15];return h}function hex(f){for(var h=0;h<f.length;h++)f[h]=rhex(f[h]);return f.join("")}function md5(f){return hex(md51(f))}function add32(f,h){return f+h&4294967295}if("5d41402abc4b2a76b9719d911017c592"!=md5("hello"))function add32(f,h){var i=(65535&f)+(65535&h);return(f>>16)+(h>>16)+(i>>16)<<16|65535&i}

// versionCompare from https://github.com/Rombecchi/version-compare
function versionCompare(e,r,n){var t=n&&n.lexicographical||!1,a=n&&n.zeroExtend||!0,i=(e||"0").split("."),u=(r||"0").split(".");function l(e){return(t?/^\d+[A-Za-zαß]*$/:/^\d+[A-Za-zαß]?$/).test(e)}if(!i.every(l)||!u.every(l))return NaN;if(a){for(;i.length<u.length;)i.push("0");for(;u.length<i.length;)u.push("0")}t||(i=i.map(function(e){var r=/[A-Za-zαß]/.exec(e);return Number(r?e.replace(r[0],"."+e.charCodeAt(r.index)):e)}),u=u.map(function(e){var r=/[A-Za-zαß]/.exec(e);return Number(r?e.replace(r[0],"."+e.charCodeAt(r.index)):e)}));for(var h=0;h<i.length;++h){if(u.length==h)return 1;if(i[h]!=u[h])return i[h]>u[h]?1:-1}return i.length!=u.length?-1:0}
function version_gt(v1,v2) { return versionCompare(v1, v2) > 0 ? true : false; }

// Brutusin forms brutusin.org
if("undefined"==typeof brutusin)window.brutusin=new Object;else if("object"!=typeof brutusin)throw"brutusin global variable already exists";!function(){String.prototype.startsWith||(String.prototype.startsWith=function(e,t){return t=t||0,this.indexOf(e,t)===t}),String.prototype.endsWith||(String.prototype.endsWith=function(e,t){var r=this.toString();(void 0===t||t>r.length)&&(t=r.length),t-=e.length;var n=r.indexOf(e,t);return-1!==n&&n===t}),String.prototype.includes||(String.prototype.includes=function(){"use strict";return-1!==String.prototype.indexOf.apply(this,arguments)}),String.prototype.format||(String.prototype.format=function(){for(var e=this,t=0;t<arguments.length;t++){var r=new RegExp("\\{"+t+"\\}","gi");e=e.replace(r,arguments[t])}return e});var BrutusinForms=new Object;BrutusinForms.messages={validationError:"Validation error",required:"This field is **required**",invalidValue:"Invalid field value",addpropNameExistent:"This property is already present in the object",addpropNameRequired:"A name is required",minItems:"At least `{0}` items are required",maxItems:"At most `{0}` items are allowed",pattern:"Value does not match pattern: `{0}`",minLength:"Value must be **at least** `{0}` characters long",maxLength:"Value must be **at most** `{0}` characters long",multipleOf:"Value must be **multiple of** `{0}`",minimum:"Value must be **greater or equal than** `{0}`",exclusiveMinimum:"Value must be **greater than** `{0}`",maximum:"Value must be **lower or equal than** `{0}`",exclusiveMaximum:"Value must be **lower than** `{0}`",minProperties:"At least `{0}` properties are required",maxProperties:"At most `{0}` properties are allowed",uniqueItems:"Array items must be unique",addItem:"Add item",true:"True",false:"False"},BrutusinForms.decorators=new Array,BrutusinForms.addDecorator=function(e){BrutusinForms.decorators[BrutusinForms.decorators.length]=e},BrutusinForms.onResolutionStarted=function(e){},BrutusinForms.onResolutionFinished=function(e){},BrutusinForms.onValidationError=function(e,t){e.focus(),e.className.includes(" error")||(e.className+=" error"),alert(t)},BrutusinForms.onValidationSuccess=function(e){e.className=e.className.replace(" error","")},BrutusinForms.postRender=null,BrutusinForms.instances=new Array,BrutusinForms.create=function(schema){var SCHEMA_ANY={type:"any"},obj=new Object,schemaMap=new Object,dependencyMap=new Object,renderInfoMap=new Object,container,data,error,initialValue,inputCounter=0,root=schema,formId="BrutusinForms#"+BrutusinForms.instances.length;renameRequiredPropeties(schema),populateSchemaMap("$",schema),validateDepencyMapIsAcyclic();var renderers=new Object;return renderers.integer=function(e,t,r,n,a){renderers.string(e,t,r,n,a)},renderers.number=function(e,t,r,n,a){renderers.string(e,t,r,n,a)},renderers.any=function(e,t,r,n,a){renderers.string(e,t,r,n,a)},renderers.string=function(e,t,r,n,a){var i,o=getSchemaId(t),s=getParentSchemaId(o),p=getSchema(o),u=getSchema(s);if("any"===p.type)i=document.createElement("textarea"),a&&(i.value=JSON.stringify(a,null,4),p.readOnly&&(i.disabled=!0));else if(p.media)(i=document.createElement("input")).type="file";else if(p.enum){if(i=document.createElement("select"),!p.required){var l=document.createElement("option"),d=document.createTextNode("");l.value="",appendChild(l,d,p),appendChild(i,l,p)}for(var c=0,m=0;m<p.enum.length;m++){l=document.createElement("option");var f=void 0,h=void 0;"object"==typeof p.enum[m]&&(f=p.enum[m].text,h=p.enum[m].value),f=void 0!==f?f:p.enum[m],h=void 0!==h?h:f;d=document.createTextNode(f);l.value=h,appendChild(l,d,p),appendChild(i,l,p),a&&h===a&&(c=m,p.required||c++,p.readOnly&&(i.disabled=!0))}1===p.enum.length?i.selectedIndex=0:i.selectedIndex=c}else{if(i=document.createElement("input"),"integer"===p.type||"number"===p.type)i.type="number",i.step=p.step?""+p.step:"any","number"!=typeof a&&(a=null);else if("date-time"===p.format)try{i.type="datetime-local"}catch(e){i.type="text"}else"date"===p.format?i.type="date":"time"===p.format?i.type="time":"email"===p.format?i.type="email":"text"===p.format?i=document.createElement("textarea"):i.type="text";null!=a&&(i.value=a,p.readOnly&&(i.disabled=!0))}return i.schema=o,i.setAttribute("autocorrect","off"),i.getValidationError=function(){try{var e=getValue(p,i);if(null===e){if(p.required){if(!u||"object"!==u.type)return BrutusinForms.messages.required;if(u.required)return BrutusinForms.messages.required;for(var t in r)if(null!==r[t])return BrutusinForms.messages.required}}else{if(p.pattern&&!p.pattern.test(e))return BrutusinForms.messages.pattern.format(p.pattern.source);if(p.minLength&&(!e||p.minLength>e.length))return BrutusinForms.messages.minLength.format(p.minLength);if(p.maxLength&&e&&p.maxLength<e.length)return BrutusinForms.messages.maxLength.format(p.maxLength)}if(null!==e&&!isNaN(e)){if(p.multipleOf&&e%p.multipleOf!=0)return BrutusinForms.messages.multipleOf.format(p.multipleOf);if(p.hasOwnProperty("maximum")){if(p.exclusiveMaximum&&e>=p.maximum)return BrutusinForms.messages.exclusiveMaximum.format(p.maximum);if(!p.exclusiveMaximum&&e>p.maximum)return BrutusinForms.messages.maximum.format(p.maximum)}if(p.hasOwnProperty("minimum")){if(p.exclusiveMinimum&&e<=p.minimum)return BrutusinForms.messages.exclusiveMinimum.format(p.minimum);if(!p.exclusiveMinimum&&e<p.minimum)return BrutusinForms.messages.minimum.format(p.minimum)}}}catch(e){return BrutusinForms.messages.invalidValue}},i.onchange=function(){var e,t;try{e=getValue(p,i)}catch(t){e=null}r?(t=r[n.getValue()],r[n.getValue()]=e):data=e,onDependencyChanged(o,i),renderAppendedProperties(o,t,e)},p.description&&(i.title=p.description,i.placeholder=p.description),i.onchange(),i.id=getInputId(),inputCounter++,appendChild(e,i,p),r},renderers.boolean=function(e,t,r,n,a){var i,o=getSchemaId(t),s=getSchema(o);if(s.required)(i=document.createElement("input")).type="checkbox",(!0===a||!1!==a&&s.default)&&(i.checked=!0);else{i=document.createElement("select");var p=document.createElement("option"),u=document.createTextNode("");u.value="",appendChild(p,u,s),appendChild(i,p,s);var l=document.createElement("option"),d=document.createTextNode(BrutusinForms.messages.true);l.value="true",appendChild(l,d,s),appendChild(i,l,s);var c=document.createElement("option"),m=document.createTextNode(BrutusinForms.messages.false);c.value="false",appendChild(c,m,s),appendChild(i,c,s),!0===a?i.selectedIndex=1:!1===a&&(i.selectedIndex=2)}i.onchange=function(){r?r[n.getValue()]=getValue(s,i):data=getValue(s,i),onDependencyChanged(o,i)},i.schema=o,i.id=getInputId(),inputCounter++,s.description&&(i.title=s.description),i.onchange(),appendChild(e,i,s)},renderers.oneOf=function(e,t,r,n,a){var i=getSchemaId(t),o=getSchema(i),s=document.createElement("select"),p=document.createElement("div");p.innerHTML="",s.type="select",s.schema=i;var u=document.createElement("option");u.value=null,appendChild(s,u,o);for(var l=0;l<o.oneOf.length;l++){var d=document.createElement("option"),c=getSchema(i+"."+l),m=document.createTextNode(c.title);if(d.value=o.oneOf[l],appendChild(d,m,o),appendChild(s,d,o),null!=a&&(o.readOnly&&(s.disabled=!0),a.hasOwnProperty("type")&&c.hasOwnProperty("properties")&&c.properties.hasOwnProperty("type"))){var f=getSchema(c.properties.type);a.type===f.enum[0]&&(s.selectedIndex=l+1,render(null,p,t+"."+(s.selectedIndex-1),r,n,a))}}s.onchange=function(){render(null,p,t+"."+(s.selectedIndex-1),r,n,a)},appendChild(e,s,o),appendChild(e,p,o)},renderers.object=function(e,t,r,n,a){function i(e,t,r,n,a,i){var o=getSchema(getSchemaId(r)),s=t.tBodies[0],p=document.createElement("tr"),u=document.createElement("td");u.className="add-prop-name";var l=document.createElement("table"),d=document.createElement("tr"),c=document.createElement("td"),m=document.createElement("td"),f="$"+Object.keys(e).length+"$",h=document.createElement("td");h.className="prop-value";var v,g=document.createElement("input");g.type="text",i&&(v=RegExp(i)),g.getValidationError=function(){return g.previousValue!==g.value&&e.hasOwnProperty(g.value)?BrutusinForms.messages.addpropNameExistent:g.value?void 0:BrutusinForms.messages.addpropNameRequired};var y=createPropertyProvider(function(){if(g.value){if(!v)return g.value;if(-1!==g.value.search(v))return g.value}return f},function(t){y.getValue()!==t&&(t&&e.hasOwnProperty(t)||(t=f),(e.hasOwnProperty(t)||v&&-1===y.getValue().search(v))&&(e[y.getValue()]=e[t],delete e[t]))});g.onblur=function(){if(g.previousValue!==g.value){for(var t=g.value,r=1;g.previousValue!==t&&e.hasOwnProperty(t);)t=g.value+"("+r+")",r++;return g.value=t,y.onchange(g.previousValue),void(g.previousValue=g.value)}};var P=document.createElement("button");P.setAttribute("type","button"),P.className="remove",appendChild(P,document.createTextNode("x"),o),P.onclick=function(){delete e[g.value],t.deleteRow(p.rowIndex),g.value=null,y.onchange(g.previousValue)},appendChild(c,g,o),appendChild(m,P,o),appendChild(d,c,o),appendChild(d,m,o),appendChild(l,d,o),appendChild(u,l,o),void 0!==i&&(g.placeholder=i),appendChild(p,u,o),appendChild(p,h,o),appendChild(s,p,o),appendChild(t,s,o),render(null,h,r,e,y,a),n&&(g.value=n,g.onblur())}var o=getSchema(getSchemaId(t)),s=new Object;r?(n.getValue()||0===n.getValue())&&(r[n.getValue()]=s):data=s;var p=document.createElement("table");p.className="object";var u=document.createElement("tbody");appendChild(p,u,o);var l=0;if(o.hasOwnProperty("properties"))for(var d in l=o.properties.length,o.properties){var c=document.createElement("tr"),m=document.createElement("td");m.className="prop-name";var f=t+"."+d,h=getSchema(getSchemaId(f)),v=document.createElement("td");v.className="prop-value",appendChild(u,c,h),appendChild(c,m,h),appendChild(c,v,h);var g=createStaticPropertyProvider(d),y=null;a&&(y=a[d]),render(m,v,f,s,g,y)}var P=[];if(o.patternProperties||o.additionalProperties){var b=document.createElement("div");if(appendChild(b,p,o),o.patternProperties)for(var O in o.patternProperties){var w=o.patternProperties[O],x=document.createElement("div");if(x.className="add-pattern-div",(S=document.createElement("button")).setAttribute("type","button"),S.pattern=O,S.id=t+"["+O+"]",S.onclick=function(){i(s,p,this.id,void 0,void 0,this.pattern)},(o.maxProperties||o.minProperties)&&(S.getValidationError=function(){return o.minProperties&&l+p.rows.length<o.minProperties?BrutusinForms.messages.minProperties.format(o.minProperties):o.maxProperties&&l+p.rows.length>o.maxProperties?BrutusinForms.messages.maxProperties.format(o.maxProperties):void 0}),w.description&&(S.title=w.description),appendChild(S,document.createTextNode("Add "+O),o),appendChild(x,S,o),a)for(var C in a)if(!o.properties||!o.properties.hasOwnProperty(C)){var E=RegExp(O);-1!==C.search(E)&&-1===P.indexOf(C)&&(i(s,p,t+"["+O+"]",C,a[C],O),P.push(C))}appendChild(b,x,o)}if(o.additionalProperties){var S,I=getSchema(o.additionalProperties);if((S=document.createElement("button")).setAttribute("type","button"),S.onclick=function(){i(s,p,t+"[*]",void 0)},(o.maxProperties||o.minProperties)&&(S.getValidationError=function(){return o.minProperties&&l+p.rows.length<o.minProperties?BrutusinForms.messages.minProperties.format(o.minProperties):o.maxProperties&&l+p.rows.length>o.maxProperties?BrutusinForms.messages.maxProperties.format(o.maxProperties):void 0}),I.description&&(S.title=I.description),appendChild(S,document.createTextNode("Add"),o),appendChild(b,S,o),a)for(var C in a)o.properties&&o.properties.hasOwnProperty(C)||-1===P.indexOf(C)&&i(s,p,t+'["'+d+'"]',C,a[C])}appendChild(e,b,o)}else appendChild(e,p,o)},renderers.array=function(e,t,r,n,a){function i(e,t,r,n,a){var i=getSchema(getSchemaId(r)),o=document.createElement("tbody"),s=document.createElement("tr");s.className="item";var p=document.createElement("td");p.className="item-index";var u=document.createElement("td");u.className="item-action";var l=document.createElement("td");l.className="item-value";var d=document.createElement("button");d.setAttribute("type","button"),d.className="remove",!0===a&&(d.disabled=!0),appendChild(d,document.createTextNode("x"),i);d.onclick=function(){e.splice(s.rowIndex,1),t.deleteRow(s.rowIndex),function(){for(var e=0;e<t.rows.length;e++)t.rows[e].cells[0].innerHTML=e+1}()},appendChild(u,d,i),appendChild(p,document.createTextNode(t.rows.length+1),i),appendChild(s,p,i),appendChild(s,u,i),appendChild(s,l,i),appendChild(o,s,i),appendChild(t,o,i);var c=createPropertyProvider(function(){return s.rowIndex});render(null,l,r,e,c,n)}var o=getSchema(getSchemaId(t)),s=getSchema(o.items),p=new Array;r?(n.getValue()||0===n.getValue())&&(r[n.getValue()]=p):data=p,n&&(n.onchange=function(e){delete r[e],r[n.getValue()]=p});var u=document.createElement("div"),l=document.createElement("table");l.className="array",appendChild(u,l,o),appendChild(e,u,o);var d=document.createElement("button");if(o.readOnly&&(d.disabled=!0),d.setAttribute("type","button"),d.className="addItem",d.getValidationError=function(){if(o.minItems&&o.minItems>l.rows.length)return BrutusinForms.messages.minItems.format(o.minItems);if(o.maxItems&&o.maxItems<l.rows.length)return BrutusinForms.messages.maxItems.format(o.maxItems);if(o.uniqueItems)for(var e=0;e<p.length;e++)for(var t=e+1;t<p.length;t++)if(JSON.stringify(p[e])===JSON.stringify(p[t]))return BrutusinForms.messages.uniqueItems},d.onclick=function(){i(p,l,t+"[#]",null)},s.description&&(d.title=s.description),appendChild(d,document.createTextNode(BrutusinForms.messages.addItem),o),appendChild(u,l,o),appendChild(u,d,o),a&&a instanceof Array)for(var c=0;c<a.length;c++)i(p,l,t+"["+c+"]",a[c],o.readOnly);appendChild(e,u,o)},obj.render=function(e,t){container=e,initialValue=t;var r=document.createElement("form");if(r.className="brutusin-form",r.onsubmit=function(e){return!1},appendChild(container||document.body,r),error){var n=document.createElement("label");appendChild(n,document.createTextNode(error)),n.className="error-message",appendChild(r,n)}else render(null,r,"$",null,null);dependencyMap.hasOwnProperty("$")&&onDependencyChanged("$"),BrutusinForms.postRender&&BrutusinForms.postRender(obj)},obj.getRenderingContainer=function(){return container},obj.validate=function(){return validate(container)},obj.getData=function(){return container?function e(t,r){if(null===r&&(r=SCHEMA_ANY),r.$ref&&(r=getDefinition(r.$ref)),t instanceof Array){if(0===t.length)return null;for(var n=new Array,a=0;a<t.length;a++)n[a]=e(t[a],r.items);return n}if(""===t)return null;if(t instanceof Object&&!(t instanceof File)){n=new Object;var i=!1;for(var o in t)if(!o.startsWith("$")||!o.endsWith("$")){var s=null;if(r.hasOwnProperty("properties")&&r.properties.hasOwnProperty(o)&&(s=r.properties[o]),null===s&&r.hasOwnProperty("additionalProperties")&&"object"==typeof r.additionalProperties&&(s=r.additionalProperties),null===s&&r.hasOwnProperty("patternProperties"))for(var p in r.patternProperties){var u=RegExp(p);if(-1!==o.search(u)){s=r.patternProperties[p];break}}var l=e(t[o],s);null!==l&&(n[o]=l,i=!0)}return i||r.required?n:null}return t}(data,schema):null},BrutusinForms.instances[BrutusinForms.instances.length]=obj,obj;function validateDepencyMapIsAcyclic(){function e(t,r,n){if(r.hasOwnProperty(n))error="Schema dependency graph has cycles";else if(r[n]=null,!t.hasOwnProperty(n)){t[n]=null;var a=dependencyMap[n];if(a)for(var i=0;i<a.length;i++)e(t,r,a[i]);delete r[n]}}var t=new Object;for(var r in dependencyMap)t.hasOwnProperty(r)||e(t,new Object,r)}function appendChild(e,t,r){e.appendChild(t);for(var n=0;n<BrutusinForms.decorators.length;n++)BrutusinForms.decorators[n](t,r)}function createPseudoSchema(e){var t=new Object;for(var r in e)"items"!==r&&"properties"!==r&&"additionalProperties"!==r&&(t[r]="pattern"===r?new RegExp(e[r]):e[r]);return t}function getDefinition(e){var t=e.split("/"),r=root;for(var n in t)"0"!==n&&(r=r[t[n]]);return r}function containsStr(e,t){for(var r=0;r<e.length;r++)if(e[r]==t)return!0;return!1}function renameRequiredPropeties(e){if(e)if(e.hasOwnProperty("oneOf"))for(var t in e.oneOf)renameRequiredPropeties(e.oneOf[t]);else if(e.hasOwnProperty("$ref")){renameRequiredPropeties(getDefinition(e.$ref))}else if("object"===e.type){if(e.properties)for(var r in e.hasOwnProperty("required")&&Array.isArray(e.required)&&(e.requiredProperties=e.required,delete e.required),e.properties)renameRequiredPropeties(e.properties[r]);if(e.patternProperties)for(var n in e.patternProperties){var a=e.patternProperties[n];(a.hasOwnProperty("type")||a.hasOwnProperty("$ref")||a.hasOwnProperty("oneOf"))&&renameRequiredPropeties(e.patternProperties[n])}e.additionalProperties&&(e.additionalProperties.hasOwnProperty("type")||e.additionalProperties.hasOwnProperty("oneOf"))&&renameRequiredPropeties(e.additionalProperties)}else"array"===e.type&&renameRequiredPropeties(e.items)}function populateSchemaMap(e,t){var r=createPseudoSchema(t);if(r.$id=e,schemaMap[e]=r,t){if(t.hasOwnProperty("oneOf"))for(var n in r.oneOf=new Array,r.type="oneOf",t.oneOf){var a=e+"."+n;r.oneOf[n]=a,populateSchemaMap(a,t.oneOf[n])}else if(t.hasOwnProperty("$ref")){var i=getDefinition(t.$ref);if(i){if(t.hasOwnProperty("title")||t.hasOwnProperty("description")){var o={};for(var s in i)o[s]=i[s];t.hasOwnProperty("title")&&(o.title=t.title),t.hasOwnProperty("description")&&(o.description=t.description),i=o}populateSchemaMap(e,i)}}else if("object"===t.type){if(t.properties)for(var s in r.properties=new Object,t.properties){a=e+"."+s;r.properties[s]=a;var p=t.properties[s];t.requiredProperties&&(containsStr(t.requiredProperties,s)?p.required=!0:p.required=!1),populateSchemaMap(a,p)}if(t.patternProperties)for(var u in r.patternProperties=new Object,t.patternProperties){var l=e+"["+u+"]";r.patternProperties[u]=l;var d=t.patternProperties[u];d.hasOwnProperty("type")||d.hasOwnProperty("$ref")||d.hasOwnProperty("oneOf")?populateSchemaMap(l,t.patternProperties[u]):populateSchemaMap(l,SCHEMA_ANY)}if(t.additionalProperties){a=e+"[*]";r.additionalProperties=a,t.additionalProperties.hasOwnProperty("type")||t.additionalProperties.hasOwnProperty("oneOf")?populateSchemaMap(a,t.additionalProperties):populateSchemaMap(a,SCHEMA_ANY)}if(t.appendedProperties&&t.appendedProperties.hasOwnProperty("dependsOn")&&t.appendedProperties.hasOwnProperty("appendix")){r.appendedProperties=new Object;var c=t.appendedProperties.dependsOn,m=t.appendedProperties.appendix;for(var f in m){var h=e+"{"+c+"}['"+f+"']";for(var v in r.appendedProperties[f]=h,populateSchemaMap(h,m[f]),m[f])populateSchemaMap(h+"."+v,m[f][v])}}}else"array"===t.type&&(r.items=e+"[#]",populateSchemaMap(r.items,t.items));if(t.hasOwnProperty("dependsOn")){null===t.dependsOn&&(t.dependsOn=["$"]);var g=new Array;for(n=0;n<t.dependsOn.length;n++)t.dependsOn[n]?t.dependsOn[n].startsWith("$")?g[n]=t.dependsOn[n]:e.endsWith("]")?g[n]=e+"."+t.dependsOn[n]:g[n]=e.substring(0,e.lastIndexOf("."))+"."+t.dependsOn[n]:g[n]="$";schemaMap[e].dependsOn=g;for(n=0;n<g.length;n++){var y=dependencyMap[g[n]];y||(y=new Array,dependencyMap[g[n]]=y),y[y.length]=e}}}}function renderTitle(e,t,r){if(e&&t){var n=document.createElement("label");if("any"!==r.type&&"object"!==r.type&&"array"!==r.type&&(n.htmlFor=getInputId()),appendChild(n,document.createTextNode(t+":"),r),r.description&&(n.title=r.description),r.required){var a=document.createElement("sup");appendChild(a,document.createTextNode("*"),r),appendChild(n,a,r),n.className="required"}appendChild(e,n,r)}}function getInputId(){return formId+"_"+inputCounter}function validate(e){var t=!0;if(e.hasOwnProperty("getValidationError")){var r=e.getValidationError();r?(BrutusinForms.onValidationError(e,r),t=!1):BrutusinForms.onValidationSuccess(e)}if(e.childNodes)for(var n=0;n<e.childNodes.length;n++)validate(e.childNodes[n])||(t=!1);return t}function clear(e){if(e)for(;e.firstChild;)e.removeChild(e.firstChild)}function render(e,t,r,n,a,i){var o=getSchemaId(r),s=getSchema(o);renderInfoMap[o]=new Object,renderInfoMap[o].titleContainer=e,renderInfoMap[o].container=t,renderInfoMap[o].parentObject=n,renderInfoMap[o].propertyProvider=a,renderInfoMap[o].value=i,clear(e),clear(t);var p=renderers[s.type];if(p&&!s.dependsOn)s.title?renderTitle(e,s.title,s):a&&renderTitle(e,a.getValue(),s),i||(i=null!=initialValue?getInitialValue(r):s.default),p(t,r,n,a,i);else if(s.$ref&&obj.schemaResolver){BrutusinForms.onResolutionStarted(n),obj.schemaResolver([r],obj.getData(),function(e){if(e&&e.hasOwnProperty(r)&&JSON.stringify(schemaMap[r])!==JSON.stringify(e[r])){cleanSchemaMap(r),cleanData(r),populateSchemaMap(r,e[r]);var t=renderInfoMap[r];t&&render(t.titleContainer,t.container,r,t.parentObject,t.propertyProvider,t.value)}BrutusinForms.onResolutionFinished(n)})}}function createPropertyProvider(e,t){var r=new Object;return r.getValue=e,r.onchange=t,r}function getInitialValue(id){var ret;try{eval("ret = initialValue"+id.substring(1))}catch(e){ret=null}return ret}function getValue(schema,input){return"function"==typeof input.getValue?input.getValue():(value="select"===input.tagName.toLowerCase()?input.options[input.selectedIndex].value:input.value,""===value?null:("integer"===schema.type?(value=parseInt(value),isFinite(value)||(value=null)):"number"===schema.type?(value=parseFloat(value),isFinite(value)||(value=null)):"boolean"===schema.type?"input"===input.tagName.toLowerCase()?(value=input.checked,value||(value=!1)):"select"===input.tagName.toLowerCase()&&(value="true"===input.value||"false"!==input.value&&null):"any"===schema.type&&value&&eval("value="+value),value));var value}function getSchemaId(e){return e.replace(/\["[^"]*"\]/g,"[*]").replace(/\[\d*\]/g,"[#]")}function getParentSchemaId(e){return e.substring(0,e.lastIndexOf("."))}function getSchema(e){return schemaMap[e]}function cleanSchemaMap(e){for(var t in schemaMap)t.startsWith(e)&&delete schemaMap[t]}function cleanData(e){new Expression(e).visit(data,function(e,t,r){delete t[r]})}function onDependencyChanged(e,t){var r=dependencyMap[e];if(r&&obj.schemaResolver){BrutusinForms.onResolutionStarted(t),obj.schemaResolver(r,obj.getData(),function(e){if(e)for(var r in e)if(JSON.stringify(schemaMap[r])!==JSON.stringify(e[r])){cleanSchemaMap(r),cleanData(r),populateSchemaMap(r,e[r]);var n=renderInfoMap[r];n&&render(n.titleContainer,n.container,r,n.parentObject,n.propertyProvider,n.value)}BrutusinForms.onResolutionFinished(t)})}}function Expression(e){null!==e&&0!==e.length&&"."!==e||(e="$");for(var t=new Array,r=function(e){if(null===e)return null;for(var t=new Array,r=null,n=0,a=0;a<e.length;a++)'"'===e.charAt(a)?null===r?r='"':'"'===r&&(r=null,t[t.length]=e.substring(n,a+1).trim(),n=a+1):"'"===e.charAt(a)?null===r?r="'":"'"===r&&(r=null,t[t.length]=e.substring(n,a+1).trim(),n=a+1):"["===e.charAt(a)?null===r&&(n!==a&&(t[t.length]=e.substring(n,a).trim()),t[t.length]="[",n=a+1):"]"===e.charAt(a)?null===r&&(n!==a&&(t[t.length]=e.substring(n,a).trim()),t[t.length]="]",n=a+1):"."===e.charAt(a)?null===r&&(n!==a&&(t[t.length]=e.substring(n,a).trim()),n=a+1):a===e.length-1&&(t[t.length]=e.substring(n,a+1).trim());return t}(e),n=!1,a=0,i="",o=0;o<r.length;o++){var s=r[o];if("["===s){if(n)throw"Error parsing expression '"+e+"': Nested [ found";n=!0,a=0,i+=s}else if("]"===s){if(!n)throw"Error parsing expression '"+e+"': Unbalanced ] found";n=!1,i+=s,t[t.length]=i,i=""}else if(n){if(a>0)throw"Error parsing expression '"+e+"': Multiple tokens found inside a bracket";i+=s,a++}else t[t.length]=s;if(o===r.length-1&&n)throw"Error parsing expression '"+e+"': Unbalanced [ found"}this.exp=e,this.queue=t,this.visit=function(e,t){!function e(r,n,a,i,o){if(null!=a){if("$"===(s=n.shift())){r="$";var s=n.shift()}if(/^\$\{(.+)\}$/.test(s)){var p=n.shift();/^\[(.+)\]$/.test(p)?(r=s+p,s=n.shift()):n.splice(0,0,p)}if(s)if(Array.isArray(a)){if(!s.startsWith("["))throw"Node '"+r+"' is of type array";if((m=s.substring(1,s.length-1)).equals("#"))for(var u=0;u<a.length;u++){var l=a[u];e(r+s,n.slice(0),l,a,u),e(r+"["+u+"]",n.slice(0),l,a,u)}else if("$"===m)l=a[a.length-1],e(r+s,n.slice(0),l,a,a.length-1);else{var d=parseInt(m);if(isNaN(d))throw"Element '"+m+"' of node '"+r+"' is not an integer, or the '$' last element symbol,  or the wilcard symbol '#'";if(d<0)throw"Element '"+m+"' of node '"+r+"' is lower than zero";l=a[d],e(r+s,n.slice(0),l,a,d)}}else{if("object"!=typeof a)throw"boolean"==typeof a||"number"==typeof a||"string"==typeof a?"Node is leaf but still are tokens remaining: "+s:"Node type '"+typeof a+"' not supported for index field '"+r+"'";if("[*]"===s)for(var c in a)l=a[c],e(r+s,n.slice(0),l,a,c),e(r+'["'+c+'"]',n.slice(0),l,a,c);else{if(s.startsWith("[")){var m;if(!(m=s.substring(1,s.length-1)).startsWith('"')&&!m.startsWith("'"))throw"Element '"+m+"' of node '"+r+"' must be a string expression or wilcard '*'";r+=s,l=a[m=m.substring(1,m.length()-1)]}else r=r.length>0?r+"."+s:s,l=a[s];e(r,n,l,a,s)}}else t(a,i,o)}}(this.exp,this.queue,e)}}function createStaticPropertyProvider(e){var t=new Object;return t.getValue=function(){return e},t.onchange=function(e){},t}function appendProperty(e,t,r,n,a){var i=getSchemaId(r),o=getSchema(i);if(o){var s=document.createElement("tr"),p=document.createElement("td");p.className="prop-name";var u=document.createElement("td");u.className="prop-value",appendChild(t,s,o),appendChild(s,p,o),appendChild(s,u,o),render(p,u,i,e,createStaticPropertyProvider(n),a)}}function renderAppendedProperties(e,t,r){var n=/^(.+)\.(.+)$/.exec(e);if(n){var a=n[1],i=n[2],o=a+"{"+i+"}",s=getSchema(a);if(s&&s.appendedProperties){var p=!1;for(var u in s.appendedProperties)if(s.appendedProperties[u].startsWith(o)){p=!0;break}if(p){var l=s.appendedProperties[t],d=s.appendedProperties[r];if(l||d){try{var c=renderInfoMap[e].container.parentElement.parentElement;renderInfoMap[e].parentObject}catch(e){return}if(void 0!==l)for(var m in renderInfoMap)if(m.startsWith(l)){var f=renderInfoMap[m];if(f){var h=f.container.parentElement;c.removeChild(h),delete renderInfoMap[m],cleanData(m)}}if(void 0!==d){var v=[],g=c.getRootNode()!==document&&initialValue?initialValue:data;for(var y in g||((g={})[i]=r),schemaMap[d])s.properties&&s.properties.hasOwnProperty(y)||v.indexOf(y)>=0||(appendProperty(data,c,d+"."+y,y,g[y]),v.push(y))}}}}}}},brutusin["json-forms"]=BrutusinForms}();

// TableSort - http://tristen.ca/tablesort/demo/
!function(){function t(e,n){if(!(this instanceof t))return new t(e,n);if(!e||"TABLE"!==e.tagName)throw new Error("Element must be a table");this.init(e,n||{})}var e=[],n=function(t){var e;return window.CustomEvent&&"function"==typeof window.CustomEvent?e=new CustomEvent(t):(e=document.createEvent("CustomEvent")).initCustomEvent(t,!1,!1,void 0),e},r=function(t){return t.getAttribute("data-sort")||t.textContent||t.innerText||""},o=function(t,e){return(t=t.trim().toLowerCase())===(e=e.trim().toLowerCase())?0:t<e?1:-1},i=function(t,e){return function(n,r){var o=t(n.td,r.td);return 0===o?e?r.index-n.index:n.index-r.index:o}};t.extend=function(t,n,r){if("function"!=typeof n||"function"!=typeof r)throw new Error("Pattern and sort must be a function");e.push({name:t,pattern:n,sort:r})},t.prototype={init:function(t,e){var n,r,o,i,s=this;if(s.table=t,s.thead=!1,s.options=e,t.rows&&t.rows.length>0)if(t.tHead&&t.tHead.rows.length>0){for(o=0;o<t.tHead.rows.length;o++)if("thead"===t.tHead.rows[o].getAttribute("data-sort-method")){n=t.tHead.rows[o];break}n||(n=t.tHead.rows[t.tHead.rows.length-1]),s.thead=!0}else n=t.rows[0];if(n){var a=function(){s.current&&s.current!==this&&s.current.removeAttribute("aria-sort"),s.current=this,s.sortTable(this)};for(o=0;o<n.cells.length;o++)(i=n.cells[o]).setAttribute("role","columnheader"),"none"!==i.getAttribute("data-sort-method")&&(i.tabindex=0,i.addEventListener("click",a,!1),null!==i.getAttribute("data-sort-default")&&(r=i));r&&(s.current=r,s.sortTable(r))}},sortTable:function(t,s){var a=t.cellIndex,d=o,u="",l=[],h=this.thead?0:1,c=t.getAttribute("data-sort-method"),f=t.getAttribute("aria-sort");if(this.table.dispatchEvent(n("beforeSort")),s||(f="ascending"===f?"descending":"descending"===f?"ascending":this.options.descending?"descending":"ascending",t.setAttribute("aria-sort",f)),!(this.table.rows.length<2)){if(!c){for(;l.length<3&&h<this.table.tBodies[0].rows.length;)(u=(u=r(this.table.tBodies[0].rows[h].cells[a])).trim()).length>0&&l.push(u),h++;if(!l)return}for(h=0;h<e.length;h++)if(u=e[h],c){if(u.name===c){d=u.sort;break}}else if(l.every(u.pattern)){d=u.sort;break}for(this.col=a,h=0;h<this.table.tBodies.length;h++){var b,g=[],w={},m=0,p=0;if(!(this.table.tBodies[h].rows.length<2)){for(b=0;b<this.table.tBodies[h].rows.length;b++)"none"===(u=this.table.tBodies[h].rows[b]).getAttribute("data-sort-method")?w[m]=u:g.push({tr:u,td:r(u.cells[this.col]),index:m}),m++;for("descending"===f?g.sort(i(d,!0)):(g.sort(i(d,!1)),g.reverse()),b=0;b<m;b++)w[b]?(u=w[b],p++):u=g[b-p].tr,this.table.tBodies[h].appendChild(u)}}this.table.dispatchEvent(n("afterSort"))}},refresh:function(){void 0!==this.current&&this.sortTable(this.current,!0)}},"undefined"!=typeof module&&module.exports?module.exports=t:window.Tablesort=t}(),function(){var t=function(t){return t.replace(/[^\-?0-9.]/g,"")};Tablesort.extend("number",function(t){return t.match(/^[-+]?[£\x24Û¢´€]?\d+\s*([,\.]\d{0,2})/)||t.match(/^[-+]?\d+\s*([,\.]\d{0,2})?[£\x24Û¢´€]/)||t.match(/^[-+]?(\d)*-?([,\.]){0,1}-?(\d)+([E,e][\-+][\d]+)?%?$/)},function(e,n){return e=t(e),function(t,e){return t=parseFloat(t),e=parseFloat(e),(t=isNaN(t)?0:t)-(e=isNaN(e)?0:e)}(n=t(n),e)})}();

// addStyle
function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    //style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

// End Libraries / Dependencies


function inIframe () {  try { return window.self !== window.top; } catch (e) { return true; } };


var settings_defaults = { 
    "refreshInterval": 60, 
    "heatFactor": "roi", 
    "hotness": 100, 
    "warmness": 30, 
    "coolness": 10, 
    "superSecret": "", 
    "refreshMarketInterval": 60, 
    "showBuyFrame": false, 
    "ignoreSoloBuySell": false, 
     }

// Get/init localStorage settings
var settings = {};
if(localStorage.hasOwnProperty('tsn-settings')){
   settings = JSON.parse(localStorage.getItem('tsn-settings'));
   }

for (var prop in settings_defaults) {
    if ( !settings.hasOwnProperty(prop) )
    {
        settings[prop] = settings_defaults[prop]
    }
} 
settings.superSecretMd5 = md5(settings.superSecret);
localStorage.setItem('tsn-settings',JSON.stringify(settings));

function showUpdates(currentVersion, changelog, scriptName) {
    var updateMessageSeen = 0;
        if(localStorage.hasOwnProperty('tsn-versionUpdate-'+scriptName)){
            updateMessageSeen = localStorage.getItem('tsn-versionUpdate-'+scriptName);
        }
        else{
            localStorage.setItem('tsn-versionUpdate-'+scriptName, 0);
        }
        if ( version_gt(currentVersion, updateMessageSeen)) {

            var updateDialog = document.createElement('div');
            updateDialog.title = "MLBTSN Helper Update"
            var updateInnerHTML = '';

            for (checkVersion in changelog) {
            
                if( version_gt(checkVersion, updateMessageSeen ) )
                {
                    updateInnerHTML += `<h3>Changelog for v${checkVersion}</h3><ul>`;
                    for ( var change of changelog[checkVersion] ) {
                        updateInnerHTML += `<li>${change}</li>`;
                    }
                    updateInnerHTML += '</ul><hr>';
                    
                }
                

            }
            
            
            updateDialog.innerHTML = updateInnerHTML;


            $( updateDialog ).dialog({
                resizable: false,
                height: "auto",
                width: 400,
                modal: true,
                buttons: {
                    "Got It!": function() {
                        localStorage.setItem('tsn-versionUpdate-'+scriptName, currentVersion);
                        $( this ).dialog( "close" );
                    },
                    Cancel: function() {
                        $( this ).dialog( "close" );
                    }
                }
            });
        }
    }



// Settings schema (uses Brutusin JSON Forms )
var schema = {}
schema = {
    "$schema": "http://json-schema.org/draft-03/schema#",
    "type": "object",
    "properties": {
        "refreshInterval": {
            "type": "integer",
            "title": "Refresh Card Page Interval (seconds)",
            "description": "Number of seconds between card info refreshes. [0 = off]",
            "default": 15,
            "required": true
            },
        "heatFactor": {
            "type": "string",
            "title": "[ Patron Feature ] Heat Factor",
            "description": "What property should gradient heat-mapping be based on?",
            "default": "salesPerMinute",
            "enum": [
                {"text": "Profit", "value": "profitMargin"},
                {"text": "PPM: Potential Profit per Minute", "value": "ppm"},
                {"text": "ROI: Return on Investment", "value": "roi"},
                {"text": "Buy Factor: Trend vs historical average", "value": "buyTrend"},
                {"text": "Sell Factor: Trend vs historical average", "value": "sellTrend"},
                {"text": "Popularity (sales per hour)", "value": "salesPerHour"},
                {"text": "Sellable #", "value": "sellable"},
                {"text": "Profit Gap: Estimated historical buy/sell gap", "value": "profitGap"},
                ],
            "required": true,
            "readOnly": true

         },
        "hotness": {
            "type": "number",
            "title": "Hotness",
            "description": "What level should be indicated as hot?",
            "default": 1,
            "required": true,
            },
        "warmness": {
            "type": "number",
            "title": "[ Patron Feature ] Warmness",
            "description": "[ Patrons Only Feature ] What level should be indicated as warm?",
            "default": 0.5,
            "required": true,
            "readOnly": true
            },
        "coolness": {
            "type": "number",
            "title": "[ Patron Feature ] Coolness",
            "description": "[ Patrons Only Feature ] What max level should be indicated as cool?",
            "default": 0.1,
            "required": true,
            "readOnly": true
            },
        "superSecret": {
                        "type": "string",
                        "title": "Game Genie",
                        "description": "To unlock features - donate (or at least say thanks) to sreyemnayr",
                        "required": true
                    },
        }
    };

// Patron settings un-readonlify

if(md5(settings.superSecret) == '2c3005677d594560df2a9724442428d1' || md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333') {
   // Settings for folks who said thanks or became patrons :)
   // or knew how to mess with the source code ;)
    for (var prop in schema.properties) {
       
        if (schema.properties.hasOwnProperty(prop)) {
           schema.properties[prop].readOnly = false;
           schema.properties[prop].title = schema.properties[prop].title.replace("[ Patron Feature ] ","");
        }
    }

   schema.properties = Object.assign({}, schema.properties, {

        "refreshMarketInterval": {
           "type": "integer",
            "title": "Refresh Interval in seconds (Community Market Helper)",
            "description": "Number of seconds between card info refreshes on community market - Only applies to favorited items. [0 = off]",
            "default": 0,
            "required": true
            },
       "showBuyFrame": {
           "type": "boolean",
            "title": "Show helper iframe?",
            "description": "Show the iframe for buy/sell/cancel orders (Community Market Helper)",
            "default": false,
            "required": true
            },
       "ignoreSoloBuySell": {
           "type": "boolean",
            "title": "Ignore single buy/sells (Completed Orders Helper)",
            "description": "Completed Orders Helper: leave out single buy/sells for better data.",
            "default": false,
            "required": true
            },
        });
    

   }


if(md5(settings.superSecret) == '68839b25c58e564a33e4bfee94fa4333'){
    // Sorry guys, this one's just for me ;)
schema.properties = Object.assign({}, schema.properties, {
       
        "autoAdjustBuy": {
            "type": "boolean",
            "title": "Auto-adjustment (buy)",
            "description": "Should outbid buys be adjusted to win?",
            "required": true,
            "default": true
        },
        "autoBuy": {
            "type": "boolean",
            "title": "Auto-buy cards?",
            "description": "Buy cards within their set threshold?",
            "required": true,
            "default": false
        },
        "autoBuyThreshold": {
            "type": "integer",
            "title": "Auto-buy threshold",
            "description": "Floor for stubbs balance",
            "default": 50000,
            "required": true
        },
        "autoBuyCards": {
            "type": "array",
            "title": "Auto-buy cards",
            "minItems": 0,
            "uniqueItems": true,
            "items": {
                "description": "Card",
                "type": "object",
                "properties": {
                    "search":{
                        "type": "string",
                        "title": "Search",
                        "description": "Search for cards",
                        "required": false
                    },
                    "cardName": {
                        "type": "string",
                        "title": "Card name",
                        "description": "Card name",
                        "required": true
                    },
                    "cardURL": {
                        "type": "string",
                        "title": "Card URL",
                        "description": "TSN URL for card",
                        "required": true
                    },
                    "enabled": {
                        "type": "boolean",
                        "title": "Auto-buy this card?",
                        "required": true,
                        "default": true

                    },
                    "threshold": {
                        "type": "integer",
                        "title": "Highest amount (in Stubbs) that should initiate a buy"
                    },
                    "max": {
                        "type": "integer",
                        "title": "Maximum number to keep in inventory"
                    }
                }
            }
        },
        "autoSell": {
            "type": "boolean",
            "title": "Auto-sell cards?",
            "description": "Sell cards within their set threshold?",
            "required": true,
            "default": false
        },
        "autoSellCards": {
            "type": "array",
            "title": "Auto-sell cards",
            "minItems": 0,
            "uniqueItems": true,
            "items": {
                "description": "Card",
                "type": "object",
                "properties": {
                    "search":{
                        "type": "string",
                        "title": "Search",
                        "description": "Search for cards",
                        "required": false
                    },
                    "cardName": {
                        "type": "string",
                        "title": "Card name",
                        "description": "Card name",
                        "required": true
                    },
                    "cardURL": {
                        "type": "string",
                        "title": "Card URL",
                        "description": "TSN URL for card",
                        "required": true
                    },
                    "enabled": {
                        "type": "boolean",
                        "title": "Auto-sell this card?",
                        "required": true,
                        "default": true

                    },
                    "threshold": {
                        "type": "integer",
                        "title": "Lowest amount (in Stubbs) that should initiate a sell"
                    },
                    "keep": {
                        "type": "integer",
                        "title": "How many of this card should we make sure to keep?",
                        "default": 1
                    }
                }
            }
        }
    });

}



// CSS Styling
addStyle(`


th[role=columnheader]:not(.no-sort) {
	cursor: pointer;
}

th[role=columnheader]:not(.no-sort):after {
	content: '';
	float: right;
	margin-top: 7px;
	border-width: 0 8px 8px;
	border-style: solid;
	border-color: #404040 transparent;
	visibility: hidden;
	opacity: 0;
	-ms-user-select: none;
	-webkit-user-select: none;
	-moz-user-select: none;
	user-select: none;
}

th[aria-sort=ascending]:not(.no-sort):after {
	border-bottom: none;
	border-width: 8px 8px 0;
}

th[aria-sort]:not(.no-sort):after {
	visibility: visible;
	opacity: 0.4;
}

th[role=columnheader]:not(.no-sort):hover:after {
	visibility: visible;
	opacity: 1;
}

.toggle-content {
	display: none !important;
}

.toggle-content.is-visible {
	display: block !important;
}

#tm-settings-button{
  padding-top:10px;
  padding-left:5px;
}

#tsn-settings-save-button{
  padding-top:2px;
  padding-left:10px;
  font-size:16pt;
  color: lime;
}

#tm-settings-form{
  display: flex;
}

.add-pattern-div{
    margin-top: 6px;
}
.loading-layer{
    position: absolute;
    top:0px;
    left:0px;
    z-index : 10;
    width: 100%;
    height: 100%;
    opacity: 0.7;
    background-color: white;
}
.loading-icon{
    position: absolute;
    top:14px;
    left:50%;
    z-index : 11;
}
.loading-icon-select{
    position: absolute;
    top:14px;
    left:50%;
    z-index : 11;
}
.loading-icon-checkbox{
    position: absolute;
    top:7px;
    left:3px;
    z-index : 11;
}
.glyphicon-refresh-animate {
    animation: spin .7s infinite linear;
    -webkit-animation: spin2 .7s infinite linear;
}

@-webkit-keyframes spin2 {
    from { -webkit-transform: rotate(0deg);}
    to { -webkit-transform: rotate(360deg);}
}

@keyframes spin {
    from { transform: scale(1) rotate(0deg);}
    to { transform: scale(1) rotate(360deg);}
}
form.brutusin-form table, form.brutusin-form input, form.brutusin-form select, form.brutusin-form textarea{
    width: 99% !important;
    min-width: 80px;
    font-size: 10pt;
    padding: 2px;
    margin: 0px;
    border-bottom: 1px solid #cecece; 
}
form.brutusin-form input[type=checkbox]{
    width: auto !important;
    min-width: auto !important;
}
form.brutusin-form  textarea{
    height: 8em;
}
form.brutusin-form table table{
    border-left:  solid 1px;
    border-color: lightgray;
    margin: 4px;
}
form.brutusin-form td {
    vertical-align: top;
    padding: 4px;
    white-space: nowrap;
}
form.brutusin-form td.prop-name {
    text-align: right;
}
form.brutusin-form td.add-prop-name table {
    text-align: right;
    border: none;
}
form.brutusin-form td.add-prop-name table td {
    vertical-align: middle;
}
form.brutusin-form td.prop-value {
    width: 100%;
    text-align: left;
}
form.brutusin-form td.item-index{
    font-size: 0.8em;
    color: lightgray;
    width: 25px;
    text-align: right;
}
form.brutusin-form td.item-action{
    width: 30px;
}
form.brutusin-form .error {
    border-color: red;
}
form.brutusin-form .error-message {
    color: red;
}
button.remove{
    padding:5px;
    background: #fff;
    color:#bb1010;
    border-radius: 20px;
    width: 25px;
    height: 25px;
    font-size:8pt;
    line-height:1pt;
}
#tm-settings {
   background-color: #f9f9f9;
}

.menu-site {     color: #fff;
    font-weight: 300;
}


.icon {
    font-size: 10px;
    margin: 0 0 0 5px;
    vertical-align: text-bottom
}

.icon:before {
    display: inline-block;
    position: relative;
    top: 1px;
    font-family: Icons;
    font-weight: 400;
    font-style: normal;
    line-height: 1;
    vertical-align: baseline;
    speak: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

}

.icon:empty:before {
    width: 1em;
    text-align: center;
    -webkit-box-sizing: content-box;
    box-sizing: content-box
}

.settings-icon:before {
   content: '\\e041';
}

.check-icon, .circle-check-icon {
   color: #66FF66;
}

.check-icon:before {
   content:'\\e033';
}

.ban-icon {
  color:#e5e5e5;
}

.ban-icon:before {
   content:'\\e017';
}

.circle-check-icon:before {
   content:'\\e038';
}

.favorites-icon-inactive {
   color:#e5e5e5 !important;
}

.favorites-icon-inactive:before {
   content:'\\e017' !important;
}

.favorites-icon-active {
   color: #66FF66 !important;
}

.favorites-icon-active:before {
   content:'\\e038' !important;
}

.items-results-table td {
  border-bottom: 1px solid white;
}

table td, table th {
    padding: 4px 4px 4px 4px !important;
}

col:nth-child(2n) {background: rgba(47, 79, 79, 0.05); }

table tr:nth-child(2n) {
    background-color: rgba(79, 79, 47, 0.05);
}

thead th:nth-child(4n) {
    border-right: 1px rgba(47, 79, 79, 0.05) solid; 
}

tr td:nth-child(4n) {
    border-right: 1px white solid;
}

// 1st rule:
    thead > :first-child th, thead > :last-child th
    {
        position: sticky;
        z-index: 1;
    }
//2nd rule
    thead > :last-child th
    {
        top: 80px;
    }
//3rd rule
    thead > :first-child th
    {
        top: 50px;
    }

tbody {
   overflow: scroll;
}

`);



// Show an element
var show = function (elem) {
	elem.classList.add('is-visible');
};

// Hide an element
var hide = function (elem) {
	elem.classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem) {
	elem.classList.toggle('is-visible');
};


(function() {
    'use strict';
    var doc = document;
    // Add hidden settings div
    var logo = $('.header-logo a')[0];
    var stubsDiv = doc.createElement('div');
    stubsDiv.id = 'helperStubsDiv';
    stubsDiv.style.color = 'white';
    stubsDiv.style.display = 'inline-block';
    logo.append(stubsDiv);
    var header = doc.getElementsByClassName('header-container')[0];
    var headerFragment = doc.createDocumentFragment();
    var settingsDiv = doc.createElement('div');
      settingsDiv.id = 'tm-settings';
      settingsDiv.classList.add('header-inner');
      settingsDiv.classList.add('toggle-content');
      var settingsHeader = doc.createElement('h2');
      settingsHeader.innerHTML = 'TSN Helper Settings';
      settingsDiv.appendChild(settingsHeader);
      var settingsForm = doc.createElement('form');
      //settingsForm.id = 'tm-settings-form';
         // Create the settings form programatically
         var BrutusinForms = brutusin["json-forms"];
         var bf = BrutusinForms.create(schema);
         BrutusinForms.addDecorator(function (element, schema) {
             if(element.tagName)
             {
                 var tag = element.tagName.toLowerCase();
                 if (tag == 'input') {
                     var elementTitle = element.title.toLowerCase();
                     if (elementTitle == "tsn url for card"){
                         element.classList.add("card-url-input");
                     }
                     if (elementTitle == "card name") {
                         element.classList.add("card-name-input");
                         
                     }
                     if (elementTitle == "search for cards"){
                         $(element).autocomplete({
                             source: "community_market/quick_search.json",
                             minLength: 2
                         }).autocomplete("instance")._renderItem = function(ul, item) {
                             var itemName = item.template.match(/name'>([^<]+)/)[1];
                             var itemUrl = item.template.match(/href=['"]([^'"?]+)/)[1];
                             item.template = item.template.replace('<a href','<span');
                             item.template = item.template.replace('href','data-href');
                             var itemLi = doc.createElement('li');
                             itemLi.innerHTML = item.template;
                             itemLi.addEventListener('click', function(e){
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-name-input').value = itemName;
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-name-input').onchange();
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-url-input').value = itemUrl;
                                 element.parentNode.parentNode.parentNode.parentNode.querySelector('input.card-url-input').onchange();
    
                             });
    
                             return $(itemLi).appendTo(ul);
                         };
                     }
                 }
                 
             }
         });
         BrutusinForms.postRender = function(instance){
             var form = instance.getRenderingContainer();
             form.querySelectorAll('input.card-name-input').forEach(function(element){
                 var parentTr = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                 /*var par = element;
                 for(var i=0;i<=10;i++){
                     par = par.parentNode;
                     console.log(i, par);
                 }*/
                 //console.log(parentTr);
                         var cardName = element.value;
                 if(cardName != ""){
                 parentTr.querySelector('.item-value').classList.add('toggle-content');
                     parentTr.querySelector('.item-action').classList.add('toggle-content');
                 }
                         var td = document.createElement('td');
                         td.classList.add("toggle-content");
                         td.classList.add("is-visible");
                         td.classList.add("item-description");
                         td.innerHTML = cardName;
                 var span = document.createElement('span');
                 span.innerHTML = cardName;
                 span.classList.add("toggle-content");
                 span.classList.add("is-visible");
                 parentTr.querySelector('.item-index').appendChild(span);


                 td.addEventListener('click',function(){
                             toggle(parentTr.querySelector('.item-value'));
                             toggle(parentTr.querySelector('.item-action'));
                             toggle(span);
                             toggle(td);
                         });
                 parentTr.querySelector('.item-index').addEventListener('click',function(){
                             toggle(parentTr.querySelector('.item-value'));
                             toggle(parentTr.querySelector('.item-action'));
                             toggle(span);
                             toggle(td);
                 });

                 parentTr.insertBefore(td,parentTr.querySelector('.item-value'));



             });
         };
         bf.render(settingsDiv, settings);
      var saveButton = doc.createElement('button');
       saveButton.innerHTML = 'Save';
    saveButton.style.margin = '4px';
       saveButton.id = 'tsn-settings-save';
      settingsDiv.appendChild(saveButton);
      saveButton.addEventListener('click', function(e){
          settings = bf.getData();
          settings.superSecretMd5 = md5(settings.superSecret);
          // console.log(settings);
          localStorage.setItem('tsn-settings', JSON.stringify(settings));
          toastr["success"]("TSN Helper Settings Updated","Saved");

      //console.log();
      });
    var saveReloadButton = doc.createElement('button');
       saveReloadButton.innerHTML = 'Save &amp; Refresh';
       saveReloadButton.id = 'tsn-settings-save-refresh';
       saveReloadButton.style.margin = '4px';
      settingsDiv.appendChild(saveReloadButton);
      saveReloadButton.addEventListener('click', function(e){
          settings = bf.getData();
          settings.superSecretMd5 = md5(settings.superSecret);
          // console.log(settings);
          localStorage.setItem('tsn-settings', JSON.stringify(settings));
          toastr["success"]("TSN Helper Settings Updated","Saved");
          window.location.reload()

      //console.log();
      });
    var closeButton = doc.createElement('button');
       closeButton.innerHTML = 'Cancel';
       closeButton.id = 'tsn-settings-close';
    closeButton.style.margin = '4px';
      settingsDiv.appendChild(closeButton);
      closeButton.addEventListener('click', function(e){

          toggle(settingsDiv);
          hide(doc.getElementById('tsn-settings-save-button0'));
          hide(doc.getElementById('tsn-settings-save-button1'));

      //console.log();
      });
      //settingsDiv.appendChild(settingsForm);
      headerFragment.appendChild(settingsDiv);


    var contentContainer = document.getElementsByClassName("layout-wrapper")[0];
    contentContainer.prepend(headerFragment);

    // Add settings icon to navigation
	var menus = doc.getElementsByClassName('menu-site');
    $(menus).each(function(menu){
    var buttonFragment = doc.createDocumentFragment();
    var li = doc.createElement('li');
    var a = doc.createElement('a');
    a.href="#";
    var settingsButton = doc.createElement('span');
    settingsButton.classList.add('settings-icon');
    settingsButton.classList.add('icon');
    // settingsButton.classList.add('button-small');
      settingsButton.id = 'tm-settings-button'+menu;
      
      a.appendChild(settingsButton);
      li.appendChild(a);
      li.addEventListener('click', function(){
       toggle(doc.getElementById('tm-settings'));
          toggle(doc.getElementById('tsn-settings-save-button'+menu));
          menu == 1 ? $('.site-offcanvas-controls-close')[0].click(): true;
      doc.getElementById('tm-settings').focus();
      });





      buttonFragment.appendChild(li);
    var li2 = doc.createElement('li');
     var saveButton2 = doc.createElement('span');
       saveButton2.classList.add('check-icon');
        saveButton2.classList.add('icon');
       saveButton2.id = 'tsn-settings-save-button'+menu;
    saveButton2.classList.add('toggle-content');
        a = doc.createElement("a");
        a.href="#";
        a.appendChild(saveButton2);
      li2.appendChild(a);
      saveButton2.addEventListener('click', function(e){
          settings = bf.getData();
          // console.log(settings);
          localStorage.setItem('tsn-settings', JSON.stringify(settings));
          toastr["success"]("TSN Helper Settings Updated","Saved");

      //console.log();
      });
    buttonFragment.appendChild(li2);
       // console.log(menu);
    menus[menu].appendChild(buttonFragment);
});

    

    // add patreon div to footer
    if (!inIframe()){

        // hijack toastr.warning to be able to intercept it for recaptcha crap
        let toastrJack = Object.assign({}, toastr);
        toastr.warning = function(e = undefined, t = undefined, n = undefined) {
            
            if(e != "Safe")
            {
                    document.getElementById('helperFrame').style.height = '100%';
                    document.getElementById('helperFrame').style.transform = 'scale(1.5,1.5)';

                toastrJack.warning(e,t,n);
            }
            else
            {
                document.getElementById('helperFrame').style.transform = '';
                if (!settings.showBuyFrame ) {
                    document.getElementById('helperFrame').style.height = '1px';
                }
                else {
                    document.getElementById('helperFrame').style.height = '300px';

                }
            }
        };

        //Object.assign(toastrJack, window.toastr);


        var patreonDiv = document.createElement('div');
        patreonDiv.innerHTML = 'Using MLBTSN Helper by sreyemnayr. Unlock more features by saying thanks! <a href="https://www.patreon.com/bePatron?u=18905935" data-patreon-widget-type="become-patron-button">Become a Patron</a><script async src="https://c6.patreon.com/becomePatronButton.bundle.js"></script>';
        $('footer').prepend(patreonDiv);

        // Display update dialog
        


    }

})();