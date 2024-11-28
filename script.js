let userInput=document.querySelector("#user-input");
let sendMessagebtn=document.querySelector("#sendMessagebtn");
let chatBox=document.querySelector("#chat-box");
let fileUpload=document.querySelector("#file-upload")

//API setup
const API_KEY="AIzaSyDyw44Hyg_Koi-l8guMVg3bz3QaV08Pto8";
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
const userData={
  messages:[],
  file:{
    data:null,
    mime_type:null
  }
};



const generateBotResponse=async(message)=>{
  const div=document.createElement("div");
  div.classList.add("message","bot-message");
  const requestOptions={
    method:"POST",
    headers:{"Content-Type": "application/json"},
    body:JSON.stringify({
      contents:[{
        parts:[{text:message},...(userData.file.data ?[{inline_data:userData.file}]:

        [])]
      }]
    })
 }
   try{
      const response=await fetch(API_URL,requestOptions);
      const data=await response.json();
      if(!response.ok) throw new Error(data.error.message);
      const apiResponseText=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
      userData.messages.push(apiResponseText);
      div.textContent=apiResponseText;
     
   }catch(error){
        console.log(error);
        div.textContent=error.message;
        div.style.color='#ff0000';
   }
   finally{
    chatBox.appendChild(div);
    chatBox.scrollTo({top:chatBox.scrollHeight,behavior:"smooth"});
   }
};

const handleOutgoingMessage=(message)=>{

    const div=document.createElement("div");
    div.classList.add("user-message","message");
    userData.messages.push(message);
    console.log( userData);
    div.textContent=message;
    chatBox.appendChild(div);
    chatBox.scrollTo({top:chatBox.scrollHeight,behavior:"smooth"});

    setTimeout(()=>{
      generateBotResponse(message);
    })

};

userInput.addEventListener('keyup',function(e){
  let message=userInput.value.trim();
  if(e.key==='Enter' && message){
    sendMessagebtn.title="message is empty";
    sendMessagebtn.classList.remove("send-btn");
    sendMessagebtn.classList.add("message-me");
    handleOutgoingMessage(message);
    userInput.value="";

  }
});

 sendMessagebtn.addEventListener('click',function(e){
    const msg=userInput.value.trim();
    if(msg){
      sendMessagebtn.title="message is empty";
      sendMessagebtn.classList.remove("send-btn");
      sendMessagebtn.classList.add("message-me");
      handleOutgoingMessage(msg);
      userInput.value="";
  
    }

})

userInput.addEventListener("input", function() {
  if (this.value.trim() !== "") {
    sendMessagebtn.title="send message";
    sendMessagebtn.classList.remove("message-me");
    sendMessagebtn.classList.add("send-btn");

  

    // Enable button if input is not empty
  } else {
    sendMessagebtn.title="message is empty";
    sendMessagebtn.classList.remove("send-btn");
    sendMessagebtn.classList.add("message-me");
   
  }
});


fileUpload.addEventListener("click",()=>{
  fileUpload.addEventListener("change",()=>{
    const file=fileUpload.files[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=(e)=>{
      const base64String=e.target.result.split(",")[1];
      userData.file={
        data:base64String,
        mime_type:file.type
      }
      fileUpload.value="";
      
    }
    reader.readAsDataURL(file);
    })
});