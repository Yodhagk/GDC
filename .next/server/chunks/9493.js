exports.id=9493,exports.ids=[9493],exports.modules={52963:(a,b,c)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0});var d={};Object.defineProperty(b,"default",{enumerable:!0,get:function(){return f.default}});var e=c(96434);Object.keys(e).forEach(function(a){!("default"===a||"__esModule"===a||Object.prototype.hasOwnProperty.call(d,a))&&(a in b&&b[a]===e[a]||Object.defineProperty(b,a,{enumerable:!0,get:function(){return e[a]}}))});var f=function(a,b){if(a&&a.__esModule)return a;if(null===a||"object"!=typeof a&&"function"!=typeof a)return{default:a};var c=g(b);if(c&&c.has(a))return c.get(a);var d={__proto__:null},e=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var f in a)if("default"!==f&&({}).hasOwnProperty.call(a,f)){var h=e?Object.getOwnPropertyDescriptor(a,f):null;h&&(h.get||h.set)?Object.defineProperty(d,f,h):d[f]=a[f]}return d.default=a,c&&c.set(a,d),d}(c(1093));function g(a){if("function"!=typeof WeakMap)return null;var b=new WeakMap,c=new WeakMap;return(g=function(a){return a?c:b})(a)}Object.keys(f).forEach(function(a){!("default"===a||"__esModule"===a||Object.prototype.hasOwnProperty.call(d,a))&&(a in b&&b[a]===f[a]||Object.defineProperty(b,a,{enumerable:!0,get:function(){return f[a]}}))})},66147:(a,b,c)=>{"use strict";c.d(b,{N:()=>n});var d=c(28120),e=c(32003),f=c(70373),g=c(81929),h=c(95012),i=c(74729),j=c.n(i),k=c(55511),l=c.n(k);function m(a){return l().createHash("sha256").update(a).digest("hex")}let n={providers:[...process.env.AZURE_AD_CLIENT_ID&&process.env.AZURE_AD_CLIENT_SECRET?[(0,e.A)({clientId:process.env.AZURE_AD_CLIENT_ID,clientSecret:process.env.AZURE_AD_CLIENT_SECRET,tenantId:process.env.AZURE_AD_TENANT_ID||"common",authorization:{params:{scope:"openid profile email"}},profile:async a=>({id:a.sub,name:a.name,email:a.email??a.preferred_username,customerId:"",role:"client"})})]:[],(0,d.A)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"},otp:{label:"Verification Code",type:"text"}},async authorize(a){if(!a?.email||!a?.password)return null;let b=await f.z.user.findUnique({where:{email:a.email.toLowerCase().trim()}});if(!b||!b.password||!await j().compare(a.password,b.password))return null;if(a.otp){if(!b.mfaCode||!b.mfaCodeExpires)throw Error("MFA_REQUIRED");if(b.mfaCodeExpires<new Date)throw Error("MFA_EXPIRED");if(b.mfaAttempts>=5)throw Error("MFA_LOCKED");if(m(a.otp.trim())!==b.mfaCode)throw await f.z.user.update({where:{id:b.id},data:{mfaAttempts:{increment:1}}}),Error(b.mfaAttempts+1>=5?"MFA_LOCKED":"MFA_INVALID");return await f.z.user.update({where:{id:b.id},data:{mfaCode:null,mfaCodeExpires:null,mfaCodeIssuedAt:null,mfaAttempts:0}}),{id:b.id,name:b.name,email:b.email,customerId:b.customerId,role:b.role}}let c=new Date;if(!(b.mfaCodeIssuedAt&&c.getTime()-b.mfaCodeIssuedAt.getTime()<6e4&&b.mfaCodeExpires&&b.mfaCodeExpires>c)){let a=l().randomInt(0,1e6).toString().padStart(6,"0");await f.z.user.update({where:{id:b.id},data:{mfaCode:m(a),mfaCodeExpires:new Date(c.getTime()+6e5),mfaCodeIssuedAt:c,mfaAttempts:0}});try{await (0,g.uD)({name:b.name,email:b.email,code:a})}catch(a){throw console.error("Failed to send MFA email:",a),Error("MFA_EMAIL_FAILED")}}throw Error("MFA_REQUIRED")}})],session:{strategy:"jwt",maxAge:2592e3},callbacks:{async signIn({user:a,account:b}){if(b?.provider!=="azure-ad")return!0;if(!a.email)return!1;let c=a.email.toLowerCase().trim(),d=await f.z.user.findUnique({where:{email:c}});if(!d){let b=(0,h.PU)();for(let a=0;a<5&&await f.z.user.findUnique({where:{customerId:b}});a++)b=(0,h.PU)();d=await f.z.user.create({data:{name:a.name||c,email:c,customerId:b}})}return a.id=d.id,a.customerId=d.customerId,a.role=d.role,!0},jwt:async({token:a,user:b})=>(b&&(a.id=b.id,a.customerId=b.customerId,a.role=b.role),a),session:async({session:a,token:b})=>(a.user&&(a.user.id=b.id,a.user.customerId=b.customerId,a.user.role=b.role),a)},pages:{signIn:"/portal/login",error:"/portal/login"},secret:process.env.NEXTAUTH_SECRET}},70373:(a,b,c)=>{"use strict";c.d(b,{z:()=>e});var d=c(96330);let e=globalThis.prisma??new d.PrismaClient({log:["error"]})},78335:()=>{},81929:(a,b,c)=>{"use strict";c.d(b,{J1:()=>i,Lc:()=>h,tk:()=>k,uD:()=>j});var d=c(52731);function e(){return d.createTransport({host:process.env.SMTP_HOST||"smtp.office365.com",port:Number(process.env.SMTP_PORT)||587,secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS},tls:{rejectUnauthorized:!1}})}let f=process.env.SUPPORT_EMAIL||"itsupport@goldendollarconsulting.com",g=process.env.SMTP_FROM||"Golden Dollar Consultancy <noreply@goldendollarconsulting.com>";async function h(a){if(!process.env.SMTP_USER||!process.env.SMTP_PASS)return;let b=e();await b.sendMail({from:g,to:f,subject:`[${a.ticketNo}] New Support Ticket: ${a.subject}`,html:`
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">New Support Ticket Raised</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Ticket #</td><td style="padding:8px">${a.ticketNo}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Client</td><td style="padding:8px">${a.clientName} (${a.clientEmail})</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Subject</td><td style="padding:8px">${a.subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Category</td><td style="padding:8px">${a.category}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Priority</td><td style="padding:8px">${a.priority}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Message</td><td style="padding:8px">${a.message}</td></tr>
        </table>
        <p style="color:#666;font-size:13px">Please log in to the IT Support dashboard to respond.</p>
      </div>`}),await b.sendMail({from:g,to:a.clientEmail,subject:`Your Support Ticket ${a.ticketNo} Has Been Received`,html:`
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">We've Received Your Ticket</h2>
        <p>Hi ${a.clientName},</p>
        <p>Your support ticket has been submitted successfully. Our IT support team will respond shortly.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Ticket #</td><td style="padding:8px">${a.ticketNo}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Subject</td><td style="padding:8px">${a.subject}</td></tr>
          <tr><td style="padding:8px;background:#f8f9fa;font-weight:bold">Priority</td><td style="padding:8px">${a.priority}</td></tr>
        </table>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy \xb7 +1 (469) 269-9784</p>
      </div>`})}async function i(a){if(!process.env.SMTP_USER||!process.env.SMTP_PASS)return void console.log(`[DEV] Password reset link for ${a.email}: ${a.resetUrl}`);let b=e();await b.sendMail({from:g,to:a.email,subject:"Reset Your Golden Dollar Consultancy Password",html:`
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Password Reset Request</h2>
        <p>Hi ${a.name},</p>
        <p>We received a request to reset the password for your client portal account. Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
        <p style="margin:24px 0">
          <a href="${a.resetUrl}" style="background:#d4a018;color:#0a1628;font-weight:bold;text-decoration:none;padding:12px 28px;border-radius:8px;display:inline-block">Reset Password</a>
        </p>
        <p style="color:#666;font-size:13px">If the button doesn't work, copy and paste this link into your browser:<br/>${a.resetUrl}</p>
        <p style="color:#666;font-size:13px">If you didn't request this, you can safely ignore this email — your password will not change.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy \xb7 +1 (469) 269-9784</p>
      </div>`})}async function j(a){if(!process.env.SMTP_USER||!process.env.SMTP_PASS)return void console.log(`[DEV] MFA code for ${a.email}: ${a.code}`);let b=e();await b.sendMail({from:g,to:a.email,subject:`${a.code} is your Golden Dollar Consultancy verification code`,html:`
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Your Verification Code</h2>
        <p>Hi ${a.name},</p>
        <p>Use this code to finish signing in to your portal. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#f8f9fa;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:20px 0;text-align:center">
          <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#0a1628">${a.code}</span>
        </div>
        <p style="color:#666;font-size:13px">If you didn't try to sign in, someone may have your password — please reset it immediately.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy \xb7 +1 (469) 269-9784</p>
      </div>`})}async function k(a){if(!process.env.SMTP_USER||!process.env.SMTP_PASS)return;let b=e();await b.sendMail({from:g,to:a.clientEmail,subject:`[${a.ticketNo}] Your Ticket Has Been Resolved`,html:`
      <div style="font-family:sans-serif;max-width:600px">
        <h2 style="color:#0a1628">Ticket Resolved</h2>
        <p>Hi ${a.clientName},</p>
        <p>Your support ticket <strong>${a.ticketNo}</strong> — <em>${a.subject}</em> — has been resolved.</p>
        <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;margin:16px 0">
          <strong>Response from IT Support:</strong><br/>${a.response}
        </div>
        <p style="color:#666;font-size:13px">If you need further assistance, please raise a new ticket from your portal.</p>
        <p style="color:#666;font-size:13px">Golden Dollar Consultancy \xb7 +1 (469) 269-9784</p>
      </div>`})}},95012:(a,b,c)=>{"use strict";c.d(b,{Ms:()=>g,PU:()=>f,w3:()=>h});var d=c(55511),e=c.n(d);function f(){let a="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",b=e().randomBytes(6),c="GDC-";for(let d=0;d<6;d++)c+=a[b[d]%a.length];return c}let g=["application/pdf","image/jpeg","image/jpg","image/png","image/gif","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document"],h=0xa00000},96434:(a,b)=>{"use strict";Object.defineProperty(b,"__esModule",{value:!0})},96487:()=>{}};