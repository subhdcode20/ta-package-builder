"use strict";(self.webpackChunkta_package_builder=self.webpackChunkta_package_builder||[]).push([[300],{2300:(e,i,l)=>{l.r(i),l.d(i,{default:()=>D});var n=l(5043),o=l(6446),r=l(1806),d=l(3460),s=l(2420),t=l(9650),a=l(4882),c=l(8076),x=l(1906),h=l(4256),u=l(279),v=l(3216),g=l(9993),A=l(207),p=l(2624),j=l(5865),f=l(5739),m=l(9778),b=l(309),y=l(889),k=l(6605),w=l(710),P=l(1337),C=l(9816),W=l(579);const N=e=>{let{packageDetails:i=[],reqData:l={}}=e;const{pickUp:n,cabType:r,dropLoc:d}=l||{},s=(0,v.Zp)();return console.log("PackageData render ",l),(0,W.jsxs)(o.A,{sx:{padding:3,marginTop:3,border:"1px solid #ddd",borderRadius:3,backgroundColor:"#f9f9f9",boxShadow:"0 2px 5px rgba(0, 0, 0, 0.1)"},children:[(0,W.jsx)(j.A,{variant:"h5",fontWeight:"bold",sx:{fontWeight:"bold",color:"#333",marginBottom:3,textAlign:"center"},children:"Package Details for selected Request:"}),(null===i||void 0===i?void 0:i.length)>0?i.map(((e,l)=>{var s,t,a,c,h,u,v,A,p,f,m,b;const N=(null===e||void 0===e?void 0:e.reqId)||"",D=null!==e&&void 0!==e&&e.createdAt?(0,g.A)(new Date(e.createdAt),"dd-MMM-yyyy"):"N/A";return console.log("PackageData render 22 ",e),(0,W.jsxs)(y.A,{sx:{marginBottom:2},children:[(0,W.jsx)(k.A,{expandIcon:(0,W.jsx)(P.A,{}),"aria-controls":"package-content-".concat(l),id:"package-header-".concat(l),children:(0,W.jsxs)(o.A,{sx:{display:"flex",justifyContent:"space-between",width:"100%"},children:[(0,W.jsxs)(j.A,{sx:{fontWeight:"bold",color:"#333"},children:["Package ",l>0?"updated":"created"," on ",(0,W.jsxs)("b",{children:[" ",D," "]})]}),(0,W.jsx)(x.A,{variant:"contained",color:"primary",href:"/itinerary/".concat(N)||0,size:"small",sx:{marginLeft:2},children:"View PDF"})]})}),(0,W.jsxs)(w.A,{children:[(0,W.jsxs)(o.A,{sx:{overflowX:"auto",border:"1px solid #ddd",borderRadius:2,backgroundColor:"#fff"},children:[(0,W.jsxs)(o.A,{sx:{display:"flex",backgroundColor:"#f0f4f7",padding:2,fontWeight:"bold",borderBottom:"1px solid #ddd"},children:[(0,W.jsx)(o.A,{sx:{flex:1,minWidth:160},children:"Detail"}),null===e||void 0===e||null===(s=e.hotels)||void 0===s?void 0:s.map(((e,i)=>(0,W.jsxs)(o.A,{sx:{flex:1,minWidth:200,maxWidth:400,textAlign:"center",wordWrap:"break-word",fontSize:"0.95em",fontWeight:"600",color:"#444"},children:["Day ",i+1]},i)))]}),(0,W.jsxs)(o.A,{sx:{display:"flex",padding:2,borderBottom:"1px solid #ddd"},children:[(0,W.jsx)(o.A,{sx:{flex:1,minWidth:160,fontWeight:"bold",color:"#666"},children:"Hotel"}),null===e||void 0===e||null===(t=e.hotels)||void 0===t?void 0:t.map(((e,i)=>{var l;return(0,W.jsx)(o.A,{sx:{flex:1,minWidth:200,textAlign:"center",wordWrap:"break-word"},children:null===e||void 0===e||null===(l=e.hotels)||void 0===l?void 0:l.map(((e,i)=>(0,W.jsxs)(j.A,{sx:{color:"#333",fontWeight:"500"},children:[(null===e||void 0===e?void 0:e.hotelName)||"N/A",(null===e||void 0===e?void 0:e.starCategory)&&(0,W.jsxs)(j.A,{component:"span",sx:{fontSize:"0.85em",color:"#777",display:"block"},children:["(",null===e||void 0===e?void 0:e.starCategory,"\u2b50)"]})]},i)))},i)}))]}),(0,W.jsxs)(o.A,{sx:{display:"flex",padding:2,borderBottom:"1px solid #ddd"},children:[(0,W.jsx)(o.A,{sx:{flex:1,minWidth:160,fontWeight:"bold",color:"#666"},children:"Location"}),null===e||void 0===e||null===(a=e.hotels)||void 0===a?void 0:a.map(((e,i)=>{var l;return(0,W.jsx)(o.A,{sx:{flex:1,minWidth:200,textAlign:"center",wordWrap:"break-word"},children:null===e||void 0===e||null===(l=e.hotels)||void 0===l?void 0:l.map(((e,i)=>(0,W.jsx)(j.A,{sx:{color:"#555"},children:(null===e||void 0===e?void 0:e.location)||"N/A"},i)))},i)}))]}),(0,W.jsxs)(o.A,{sx:{display:"flex",padding:2},children:[(0,W.jsx)(o.A,{sx:{flex:1,minWidth:160,fontWeight:"bold",color:"#666"},children:"Room"}),null===e||void 0===e||null===(c=e.hotels)||void 0===c?void 0:c.map(((e,i)=>{var l;return(0,W.jsx)(o.A,{sx:{flex:1,minWidth:200,textAlign:"center",wordWrap:"break-word"},children:null===e||void 0===e||null===(l=e.hotels)||void 0===l?void 0:l.map(((e,i)=>{var l;return(0,W.jsx)(o.A,{sx:{padding:2},children:null===e||void 0===e||null===(l=e.selectedRooms)||void 0===l?void 0:l.map(((i,l)=>{var n,r,d;return(0,W.jsxs)(o.A,{sx:{borderBottom:l!==(null===e||void 0===e||null===(n=e.selectedRooms)||void 0===n?void 0:n.length)-1?"1px solid #ddd":"none",paddingBottom:2,marginBottom:2},children:[(0,W.jsx)(j.A,{sx:{color:"#444",fontWeight:"500"},children:(null===i||void 0===i?void 0:i.roomName)||"N/A"}),(0,W.jsx)(j.A,{sx:{fontSize:"0.85em",color:"#666"},children:(null===i||void 0===i?void 0:i.mp)||"N/A"}),(0,W.jsxs)(j.A,{sx:{fontSize:"0.85em",color:"#666"},children:[(null===i||void 0===i||null===(r=i.selectedOccupancy)||void 0===r?void 0:r.adults)||"0"," Adult,"," ",(null===i||void 0===i||null===(d=i.selectedOccupancy)||void 0===d?void 0:d.child)||"0"," Child"]})]},l)}))},i)}))},i)}))]})]}),(0,W.jsxs)(o.A,{sx:{display:"flex",border:"1px solid #ddd",borderRadius:2,padding:3,textAlign:"left",marginBottom:3,marginTop:3,backgroundColor:"#fff",gap:3},children:[(0,W.jsxs)(o.A,{sx:{flex:1},children:[(0,W.jsx)(j.A,{variant:"h6",sx:{fontWeight:"bold",color:"#444",marginBottom:2},children:"Transfer Section"}),(0,W.jsxs)(j.A,{sx:{color:"#555",marginTop:1},children:["All tours and transfers are private by ",r||""," from ",n||""," dropping at ",d||""]})]}),((null===(h=i[0])||void 0===h||null===(u=h.flights)||void 0===u?void 0:u.arr)||(null===(v=i[0])||void 0===v||null===(A=v.flights)||void 0===A?void 0:A.dep))&&(0,W.jsxs)(o.A,{sx:{flex:1},children:[(0,W.jsx)(j.A,{variant:"h6",sx:{fontWeight:"bold",color:"#444",marginBottom:2},children:"Flight Section"}),(0,W.jsxs)(o.A,{sx:{marginBottom:2},children:[(0,W.jsxs)(j.A,{sx:{color:"#555",marginBottom:1},children:["Arrival Time: ",(null===(p=i[0])||void 0===p||null===(f=p.flights)||void 0===f?void 0:f.arr)||"N/A"]}),(0,W.jsxs)(j.A,{sx:{color:"#555",marginBottom:1},children:["Departure Time: ",(null===(m=i[0])||void 0===m||null===(b=m.flights)||void 0===b?void 0:b.dep)||"N/A"]})]})]})]}),(0,W.jsxs)(o.A,{sx:{border:"1px solid #ddd",borderRadius:2,padding:3,textAlign:"left",backgroundColor:"#fff"},children:[(0,W.jsx)(j.A,{variant:"h6",sx:{fontWeight:"bold",color:"#444",marginBottom:2},children:"Price Section"}),(null===e||void 0===e?void 0:e.finalTransferPrice)&&!(0,C.RI)(null===e||void 0===e?void 0:e.finalTransferPrice)&&!isNaN(null===e||void 0===e?void 0:e.finalTransferPrice)&&(0,W.jsxs)(W.Fragment,{children:[(0,W.jsxs)(j.A,{sx:{color:"#555",marginBottom:1},children:["Hotel Price: \u20b9",Number(null===e||void 0===e?void 0:e.finalPackPrice)-Number(null===e||void 0===e?void 0:e.finalTransferPrice)||"0"]}),(0,W.jsxs)(j.A,{sx:{color:"#555",marginBottom:1},children:["Transfer Price: \u20b9",(null===e||void 0===e?void 0:e.finalTransferPrice)||"0"]})]}),(0,W.jsxs)(j.A,{sx:{color:"#000",fontWeight:"bold"},children:["Total Package Price: \u20b9",(null===e||void 0===e?void 0:e.finalPackPrice)||"0"]})]})]})]},l)})):(0,W.jsxs)(o.A,{sx:{m:2,display:"flex",width:"max-content",justifyContent:"space-evenly"},children:[(0,W.jsx)(j.A,{variant:"body2",sx:{margin:"auto"},children:"No packages created for this Request! Try Fastest way to a professional Itinerary/Quote pdf"}),"\xa0",(0,W.jsx)(x.A,{size:"small",variant:"contained",onClick:()=>s("/itinerary/"+(null===l||void 0===l?void 0:l.reqId)),children:"Now!"})]})]})},D=e=>{let{reqsList:i=[]}=e;const[l,y]=n.useState([]),[k,w]=n.useState(null),[P,D]=n.useState(null),[S,z]=n.useState(null),[T,q]=n.useState(0),[B,I]=n.useState(5),R=(0,v.Zp)(),M=(0,C.zm)();n.useEffect((()=>{i&&y(i.map((e=>e)))}),[i]),n.useEffect((()=>{M&&M.get("reqId")&&l&&F(M.get("reqId"))}),[M,l]);const F=async e=>{w(e);const i=l.find((i=>i.id===e));if(!i)return;console.log("selected row ",i),z(i);let{packages:n=[]}=i;if(null!==n&&void 0!==n&&n.length){const e=await Promise.all(n.map((async e=>{const i=(0,f.H9)(b.db,"packages",e),l=await(0,f.x7)(i);return l.exists()?l.data():{error:"No such document"}})));D(e)}else D(null)};return(0,W.jsxs)(o.A,{sx:{margin:"auto",width:"100%",overflowX:"auto"},children:[(0,W.jsxs)(t.A,{children:[(0,W.jsxs)(r.A,{stickyHeader:!0,size:"small",children:[(0,W.jsx)(a.A,{children:(0,W.jsxs)(c.A,{children:[(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Select"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Created On"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Dest"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Travel Date"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Nights"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Pick Up"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Hotel Category"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Adult"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Child"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Tracking ID"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Package Created"})}),(0,W.jsx)(s.A,{children:(0,W.jsx)("b",{children:"Actions"})})]})}),(0,W.jsx)(d.A,{children:l.slice(T*B,T*B+B).map((e=>{var i;return(0,W.jsxs)(c.A,{children:[(0,W.jsx)(s.A,{children:(0,W.jsx)(h.A,{checked:(null===S||void 0===S?void 0:S.id)===e.id,onChange:()=>F(e.id,e.packages)})}),(0,W.jsx)(s.A,{children:(0,g.A)(new Date(e.createdAt),"dd-MMM-yyyy")}),(0,W.jsx)(s.A,{children:e.destination}),(0,W.jsx)(s.A,{children:(0,g.A)(new Date(e.startDate),"dd-MMM-yyyy")}),(0,W.jsx)(s.A,{children:e.noOfNights}),(0,W.jsx)(s.A,{children:e.pickUp}),(0,W.jsx)(s.A,{children:null===(i=e.starCategory)||void 0===i?void 0:i.label}),(0,W.jsx)(s.A,{children:e.totalAdults}),(0,W.jsx)(s.A,{children:e.totalChild}),(0,W.jsx)(s.A,{children:e.trackingId}),(0,W.jsx)(s.A,{children:e.packages&&e.packages.length>0?(0,W.jsxs)(o.A,{display:"flex",flexDirection:"row",children:[(0,W.jsx)(m.A,{sx:{color:"green",marginY:"auto",fontSize:"15px"}}),(0,W.jsx)(x.A,{size:"small",variant:"text",onClick:()=>F(e.id,e.packages),children:"View"})]}):null}),(0,W.jsx)(s.A,{children:(0,W.jsxs)(o.A,{display:"flex",flexDirection:"column",justifyContent:"space-evenly",children:[(0,W.jsx)(x.A,{size:"small",variant:"outlined",color:"primary",onClick:()=>{return i=e.reqId,void R("/request/".concat(i,"/edit"));var i},sx:{fontSize:"10px",mb:1},children:"Edit Request"}),0==((null===e||void 0===e?void 0:e.packages)||[]).length&&(0,W.jsx)(x.A,{size:"small",variant:"outlined",color:"primary",onClick:()=>R("/itinerary/".concat(e.reqId)),sx:{fontSize:"10px",mb:1},children:"Create Package Pdf"}),((null===e||void 0===e?void 0:e.packages)||[]).length>0&&(0,W.jsx)(x.A,{size:"small",variant:"outlined",color:"primary",onClick:()=>R("/itinerary/".concat(e.reqId)),sx:{fontSize:"10px",mb:1},children:"Update Package Pdf"}),((null===e||void 0===e?void 0:e.packages)||[]).length>0&&(0,W.jsx)(x.A,{size:"small",variant:"outlined",color:"primary",onClick:()=>{return i=e.reqId,void R("/request/".concat(i,"/copy-new"));var i},sx:{fontSize:"10px",mb:1},children:"Copy to New Package"})]})})]},e.id)}))}),(0,W.jsx)(A.A,{children:(0,W.jsx)(c.A,{children:(0,W.jsx)(p.A,{rowsPerPageOptions:[5,10,15],count:l.length,rowsPerPage:B,page:T,onPageChange:(e,i)=>{q(i)},onRowsPerPageChange:e=>{I(parseInt(e.target.value,10)),q(0)}})})})]}),0==l.length&&(0,W.jsxs)(o.A,{sx:{m:2,display:"flex",width:"max-content",justifyContent:"space-evenly"},children:[(0,W.jsx)(j.A,{variant:"body2",sx:{margin:"auto"},children:"No Requests Created Yet! Try Fastest way to a professional Itinerary/Quote pdf"}),(0,W.jsx)(x.A,{size:"small",variant:"text",onClick:()=>R("/home"),children:"Now!"})]})]}),S&&(0,W.jsx)(u.A,{in:!!S,children:(0,W.jsx)(N,{packageDetails:P,reqData:S})})]})}}}]);
//# sourceMappingURL=300.f263573c.chunk.js.map