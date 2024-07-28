/*! name: vanilla-calendar-pro | url: https://github.com/uvarov-frontend/vanilla-calendar-pro */
const getDateString$1=t=>`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`,getDate$1=t=>new Date(`${t}T00:00:00`),parseDates$1=t=>t.reduce(((t,e)=>{if(e instanceof Date||"number"==typeof e){const a=e instanceof Date?e:new Date(e);t.push(a.toISOString().substring(0,10))}else e.match(/^(\d{4}-\d{2}-\d{2})$/g)?t.push(e):e.replace(/(\d{4}-\d{2}-\d{2}).*?(\d{4}-\d{2}-\d{2})/g,((e,a,g)=>{const r=getDate$1(a),n=getDate$1(g),D=new Date(r.getTime());for(;D<=n;D.setDate(D.getDate()+1))t.push(getDateString$1(D));return e}));return t}),[]),parseDates=t=>parseDates$1(t),getDateString=t=>getDateString$1(t),getDate=t=>getDate$1(t);export{getDate,getDateString,parseDates};