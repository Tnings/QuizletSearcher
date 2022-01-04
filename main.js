window.onload = function (){
    console.log('loaded');

    const file_upload_button = document.getElementById("file_upload_button");
    const file_upload = document.getElementById("file_upload");
    const upload_file_box = document.getElementById("upload_file_box");
    const output_container = document.getElementById("output_container");
    const terms_settings = document.getElementById("terms_settings");
    const search_input = document.getElementById("search_input");
    let term_num = 0;

    file_upload_button.value = "";

    file_upload.addEventListener("click", upload_trigger);
    upload_file_box.addEventListener("click", upload_trigger);

    file_upload_button.addEventListener("change", handle_file)

    function upload_trigger(){
        file_upload_button.click();
    }

    async function handle_file(){
        await file_upload_button.files[0].text().then(response => process_data(response));
    }

    function process_data(text){
        // Hide Upload File Box
        upload_file_box.style.display = "none";
        delete_all_children(output_container);
        load_children(text);

        search_input.addEventListener("input", function (e){
            delete_all_children(output_container);
            load_children(text);

            let children = output_container.children;

            for(let i = 0; i < children.length; ++i){
                let card = children[i];
                let question;
                let answer;

                for(let q = 0; q < card.children.length; ++q){
                    let child = card.children[q];

                    if(child.tagName === "DIV"){
                        continue;
                    }

                    if(child.tagName === "QUESTION"){
                        question = child;
                    }
                    if(child.tagName === "ANSWER"){
                        answer = child;
                    }
                }


                if(!question.innerText.includes(search_input.value)
                    && !answer.innerText.includes(search_input.value)){
                    card.style.display = "none";
                    term_num--;
                    terms_settings.innerText = "Terms in this Set: " + term_num;
                }
                if(question.innerText.includes(search_input.value)){
                    highlight_text(question,search_input.value);
                }
                else if(answer.innerText.includes(search_input.value)){
                    highlight_text(answer,search_input.value);
                }
            }
        });

    }

    function create_child_card(q, a){
        let card = document.createElement("div");
        let question = document.createElement("question");
        let answer = document.createElement("answer");
        let card_separation = document.createElement("div");

        question.innerText = q;
        answer.innerText = a;

        card.appendChild(question);
        card.appendChild(card_separation);
        card.appendChild(answer);

        card.className = "card";
        question.className = "question";
        answer.className = "answer";
        card_separation.className = "card_separation";

        output_container.appendChild(card);
        term_num++;
    }

    function load_children(text){

        term_num = 0;

        let template = {
            "Question":"",
            "Answer":""
        }

        while(text.includes("~!!") && text.includes("-;;")){ //  Loops as long as the text has necessary markers
            template.Question = text.substring(0,text.indexOf("~!!"));
            template.Answer = text.substring(text.indexOf("~!!")+3,text.indexOf("-;;"));

            create_child_card(template.Question, template.Answer);

            text = text.substring(text.indexOf("-;;")+3);
        }

        terms_settings.innerText = "Terms in this Set: " + term_num;
    }

    function delete_all_children(parent){
        while(parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    function highlight_text(element,text){
        let innerHTML = element.innerHTML;
        let index = innerHTML.indexOf(text);
        if (index >= 0) {
            innerHTML = innerHTML.substring(0,index) + "<span class='highlight'>" + innerHTML.substring(index,index+text.length) + "</span>" + innerHTML.substring(index + text.length);
            element.innerHTML = innerHTML;
        }
    }

}