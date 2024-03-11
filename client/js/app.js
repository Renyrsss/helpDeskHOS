document.addEventListener("DOMContentLoaded", function () {
    const token = '6515245927:AAExFk8USVwQ2IVcwtqszfutM-hqgbfp0Dg';
    let CHAT_ID = -4133903157;
    const URI_API =  `https://api.telegram.org/bot${token}/sendMessage`;
    let success = document.querySelector('.success');
    let successImg = document.querySelector('.success__img');
    let checkedOrNot = document.querySelector('.checkedOrNot');
    let inputsRadio = document.querySelectorAll('.inputMar')
    let imageContainer = document.getElementsByTagName("body");
    let userDataQuery = getUsersQuery();
    // preloadImage("../img/image\ 1.svg","../img/image2.png","../img/image3.png", imageContainer[0]);

    let radioInput = document.querySelectorAll('.radioInput');
    // console.log(radioInput);
    let inputs = document.querySelectorAll('.main__inputs');
    let textArea = document.querySelector('textarea');
    // console.log(textArea);
    let btn = document.querySelector('.btn__submit');
    // console.log(btn);
    let admin = null;







    btn.addEventListener('click',(e)=>{
        e.preventDefault();
        let res = checkInputs(inputs,textArea,checkedOrNot,radioInput);
        console.log(res);
            if(res){
                let query ;

                
                let massage = `<b>Заявка  ${query}</b>\n`;
                massage +=  `<b>ФИО : ${inputs[1].value}</b>\n`;
                massage +=  `<b>Отделение : ${inputs[2].value}</b>\n`;
                massage +=  `<b>Телефон : ${inputs[0].value}</b>\n`
                massage += `<b>Комментарий : ${textArea.value}</b>\n`;
                massage += `<b>Запрос : ${query}</b>\n`;
                axios.post(`http://192.168.101.25:1338${/api/zayavkis}`,{
                    data:{
                        userName : inputs[1].value,
                        userPhone : inputs[0].value,
                        userSide : inputs[2].value,
                        userComment : textArea.value,
                        userQuery : query
                    }
                
                })
                .then((res) => {
                    inputs.forEach(item=>item.value = '');
                    textArea.value = '';
                    success.style.display = 'block';
                    successImg.classList.add('successLoadingActive');


                    axios.post(URI_API,{
                            chat_id:CHAT_ID,
                            parse_mode: 'html',
                            text:massage
                        })
                        .then((res) => {
                            
                        })
                        .catch((err) =>{
                            console.log(err);
                        })


                    setTimeout(() => {
                        success.style.display = 'none'
                        successImg.classList.remove('successLoadingActive');
                        
                    }, 3400);
                })
                .then(()=>{
                    userDataQuery = '';
                    userDataQuery = getUsersQuery();
                    
                })
                .then(()=>{
                    queryListAdd()
                })
                .catch((err) =>{
                    console.log(err);
                })
                


            }
    })
    // console.log(inputs);
    let searchInput = document.querySelector('.main__searchInput');

    let userPhones = [];
    let catalog = document.querySelector('.main__catalog');
    function queryListAdd(){
        userDataQuery.then(function(res){
        // console.log(res);
        searchInput.addEventListener('input',(e)=>{
            catalog.innerHTML = ``;
            userPhones = [];
            res.forEach(item => {
                console.log(item);
            // console.log(item.userPhone);
            if(item.userPhone.indexOf(e.target.value) === 0){
                // console.log('true');
                userPhones.push(item)
            }
            

        })
        // .slice(0,-14)
        if(e.target.value.length >=5){
            userPhones.forEach(item=>{
                if(item.Progress == 'Сделано'){
                    catalog.innerHTML += `
                    <div class="main__catalogItem ">
                        <p class="main__catalogId"> ${item.userName}</p>
                        <p class="main__catalogDate">Дата ${item.createdAt}</p>
                        <p class="main__catalogItemName">${item.userQuery}</p>
                        <p class="main__catalogItemComment">${item.userComment}</p>
                        <p class="main__catalogItemProgress"><span class="main__catalogItemProgressbar greenDone">${item.Progress}</span></p>
                    </div>
                    `;
                }
                else if(item.Progress == 'в работе'){
                    catalog.innerHTML += `
                    <div class="main__catalogItem ">
                        <p class="main__catalogId"> ${item.userName}</p>
                        <p class="main__catalogDate">Дата ${item.createdAt.slice(0,-14)}</p>
                        <p class="main__catalogItemName">${item.userQuery}</p>
                        <p class="main__catalogItemComment">${item.userComment}</p>
                        <p class="main__catalogItemProgress"><span class="main__catalogItemProgressbar yellowInWork">${item.Progress}</span></p>
                    </div>
                    `;
                }
                else if (item.Progress == 'Новая заявка'){
                    catalog.innerHTML += `
                    <div class="main__catalogItem ">
                        <p class="main__catalogId"> ${item.userName}</p>
                        <p class="main__catalogDate">Дата ${item.createdAt}</p>
                        <p class="main__catalogItemName">${item.userQuery}</p>
                        <p class="main__catalogItemComment">${item.userComment}</p>
                        <p class="main__catalogItemProgress"><span class="main__catalogItemProgressbar blueNewQuery">${item.Progress}</span></p>
                    </div>
                    `;
                }
        })
        }
    })
        
    })
}

    
    queryListAdd();





    // ------------------------------------




});




function checkInputs(inputs,textArea,checkedOrNot,inputsRadio){
    let res = true
    inputs.forEach(element => {
        if(element.value.trim() == ''){
            console.log('error');
            element.style.cssText = `
            border:2px solid red
            `;
            res = false
        }
        else{
            element.style.cssText = `none`
        }
        
    });

    if(textArea.value.trim() == ''){
        console.log('error');
        textArea.style.cssText = `border:2px solid red`;
        res = false
    }
    else{
        textArea.style.cssText = `none`
    }

    console.log(inputsRadio);
    let radioFalse = false;
    inputsRadio.forEach(item =>{
        if(item.checked == false){
            console.log(item.checked);
        }
        else if(item.checked){
            radioFalse = true
        }
    })
    if(radioFalse){
        checkedOrNot.style.cssText = ``;
    }
    else{
        checkedOrNot.style.cssText = `border:4px solid red`;
        res = false
    }
    return res;
}


async function getUsersQuery(){

            let userObj = [];

            await axios.get('http://192.168.101.25:1338/api/zayavkis?pagination[pageSize]=1000&sort=createdAt:desc').then(function(res){
                res.data['data'].map(item => {
                    userObj.push(item.attributes)
                })
            });


            // console.log(userObj);
        return userObj;
}


// async function changeCotalog(items){
//     let changeCatalog = document.querySelector('.main_catalogItem');

//     changeCatalog.innerHTML += `
//                 <div class="main__catalogItem">
//                     <p class="main__catalogId"> id : 144</p>
//                     <p class="main__catalogDate">Дата ${items.createdAt}</p>
//                     <p class="main__catalogItemName">${items.userName}</p>
//                     <p class="main__catalogItemComment">${items.userComment}</p>
//                     <p class="main__catalogItemProgress"><span class="main__catalogItemProgressbar">${items.Progress}</span></p>
//                 </div>
//     `
// }