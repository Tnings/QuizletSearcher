window.onload = function (){
    console.log('loaded');

    const file_upload_button = document.getElementById("file_upload_button");
    const file_upload = document.getElementById("file_upload");
    const upload_file_box = document.getElementById("upload_file_box");
    const output_container = document.getElementById("output_container");
    const terms = document.getElementById("terms");
    const search_input = document.getElementById("search_input");
    const order = document.getElementById("order");
    const down_arrow = document.getElementById("down_arrow");
    const up_arrow = document.getElementById("up_arrow");
    let order_value = "down";
    let term_num = 0;
    let console_mode = false;

    let text = null;
    file_upload_button.value = "";

    file_upload.addEventListener("click", upload_trigger);
    upload_file_box.addEventListener("click", upload_trigger);
    order.addEventListener("click", toggle_order);

    file_upload_button.addEventListener("change", handle_file)

    function toggle_order(){
        if(order_value === "down"){
            down_arrow.style.display = "none";
            up_arrow.style.display = "block";
            order_value = "up";
        }
        else if(order_value === "up"){
            down_arrow.style.display = "block";
            up_arrow.style.display = "none";
            order_value = "down";
        }

        delete_all_children(output_container);
        load_children(text);
    }

    function upload_trigger(){
        file_upload_button.click();
    }

    async function handle_file(){
        await file_upload_button.files[0].text().then(response => process_data(response));
    }

    function process_data(response){
        text = response;
        order.style.display = "block";

        // Hide Upload File Box
        upload_file_box.style.display = "none";
        delete_all_children(output_container);
        load_children(text);

        search_input.addEventListener("input", function (e){
            delete_all_children(output_container);
            load_children(text);

            let children = output_container.children;

            if(search_input.value.substring(0,1) === ":" && !console_mode){
                console.log("Entering console mode");
                console_mode = true;
                search_input.style.background = "url(icons/right_icon.svg) no-repeat scroll 16px 10px";
            }
            if(search_input.value.charAt(0) === "" && console_mode){
                console.log("Exiting console mode");
                console_mode = false;
                search_input.style.background = "url(icons/search_icon.svg) no-repeat scroll 16px 10px";
            }

            if(console_mode && search_input.value.substring(0,2) === ":q"){
                console.log("Searching questions only");
                let value = search_input.value.substring(3);

                for (let i = 0; i < children.length; ++i) {
                    let card = children[i];
                    let question;
                    let answer;

                    for (let q = 0; q < card.children.length; ++q) {
                        let child = card.children[q];

                        if (child.tagName === "DIV") {
                            continue;
                        }

                        if (child.tagName === "QUESTION") {
                            question = child;
                        }
                        if (child.tagName === "ANSWER") {
                            answer = child;
                        }
                    }


                    if (!question.innerText.includes(value)) {
                        card.style.display = "none";
                        term_num--;
                        terms.innerText = "Terms in this Set: " + term_num;
                    }
                    if (question.innerText.includes(value)) {
                        highlight_text(question, value);
                    }
                }
            }

            if(console_mode && search_input.value.substring(0,2) === ":a"){
                console.log("Searching answers only");
                let value = search_input.value.substring(3);

                for (let i = 0; i < children.length; ++i) {
                    let card = children[i];
                    let question;
                    let answer;

                    for (let q = 0; q < card.children.length; ++q) {
                        let child = card.children[q];

                        if (child.tagName === "DIV") {
                            continue;
                        }

                        if (child.tagName === "QUESTION") {
                            question = child;
                        }
                        if (child.tagName === "ANSWER") {
                            answer = child;
                        }
                    }


                    if (!answer.innerText.includes(value)) {
                        card.style.display = "none";
                        term_num--;
                        terms.innerText = "Terms in this Set: " + term_num;
                    }
                    if (answer.innerText.includes(value)) {
                        highlight_text(answer, value);
                    }
                }
            }

            if(!console_mode) {
                for (let i = 0; i < children.length; ++i) {
                    let card = children[i];
                    let question;
                    let answer;

                    for (let q = 0; q < card.children.length; ++q) {
                        let child = card.children[q];

                        if (child.tagName === "DIV") {
                            continue;
                        }

                        if (child.tagName === "QUESTION") {
                            question = child;
                        }
                        if (child.tagName === "ANSWER") {
                            answer = child;
                        }
                    }


                    if (!question.innerText.includes(search_input.value)
                        && !answer.innerText.includes(search_input.value)) {
                        card.style.display = "none";
                        term_num--;
                        terms.innerText = "Terms in this Set: " + term_num;
                    }
                    if (question.innerText.includes(search_input.value)) {
                        highlight_text(question, search_input.value);
                    } else if (answer.innerText.includes(search_input.value)) {
                        highlight_text(answer, search_input.value);
                    }
                }
            }
        });

    }

    function create_child_card(q, a){
        let card = document.createElement("div");
        let question = document.createElement("question");
        let answer = document.createElement("answer");

        question.innerText = q;
        answer.innerText = a;

        card.appendChild(question);
        card.appendChild(answer);

        card.className = "card";
        question.className = "question";
        answer.className = "answer";

        output_container.appendChild(card);
        term_num++;
    }

    function load_children(text){

        term_num = 0;

        let template = {
            "Question":"",
            "Answer":""
        }

        while(text.includes("~!!") && text.includes("-;;")) { //  Loops as long as the text has necessary markers
            template.Question = text.substring(0, text.indexOf("~!!"));
            template.Answer = text.substring(text.indexOf("~!!") + 3, text.indexOf("-;;"));

            create_child_card(template.Question, template.Answer);

            text = text.substring(text.indexOf("-;;") + 3);
        }

        if(order_value === "up"){
            output_container.style.display = "flex";
            output_container.style.flexDirection = "column-reverse";
        }
        if(order_value === "down"){
            output_container.style.display = "block";
        }

        terms.innerText = "Terms in this Set: " + term_num;
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