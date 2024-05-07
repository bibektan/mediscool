import styles from '../css/Editor.module.css'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { useEffect, useState } from "react";

function Editor() {

    let [title, setTitle] = useState('title')
    let [body, setBody] = useState('body')
    let [currentpopupelement, setCurrentPopupElement] = useState()

    // initializing popover.js
    function initializePopovers() {
        const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
        const popoverList = [...popoverTriggerList].map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
    }

    function initializeTooltips(){
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
        const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    }

    useEffect(()=>{

        // popover initialization
        initializePopovers();
        initializeTooltips();

        const handleKeyDown = (event) => {

            const selObj = window.getSelection();
            let selected = selObj.toString();
            console.log(selected.length)
            if(selected.length > 0){
                const range = selObj.getRangeAt(0);
                // range.deleteContents();
                // range.insertNode(span);
    
                // crtl + alt + L => for link
                if (event.ctrlKey && event.altKey && event.code === 'KeyL') {

                    const url = prompt('Enter the URL for the link:')
                    if (url){
                        range.deleteContents();
        
                        var link = document.createElement("a")
                        link.setAttribute("href", url)
                        link.textContent = selected
        
                        range.insertNode(link);
                        console.log('Ctrl+Shift+L shortcut pressed');
                    }
                }

                // ctrl + alt + b => for button
                if (event.ctrlKey && event.altKey && event.code === 'KeyB'){
                    makePopup('button')
                }
            }
        };

        // for keyboard
        window.addEventListener('keydown', handleKeyDown);

        // for mouse right click
        window.addEventListener('contextmenu', (e) => {
            // e.preventDefault()
            e.stopPropagation()
            e.stopImmediatePropagation()
            console.log('right clicked')

            // let rightClickEvent = document.querySelectorAll('[data-rightclickevent]')

            // if(e.target.getAttribute("data-editable-or-non-editable-mode") === "noneditable"){
            //     if(rightClickEvent.length > 0){
            //         for (let index = 0; index < rightClickEvent.length; index++) {
            //             const element = rightClickEvent[index];
            //             if(element.contains(e.target)){
            //                 let event = element.getAttribute("data-rightclickevent")
            //                 eval(event)(e)
            //             }
            //         }
            //     }
            // }

        });

        // for mouse left click
        window.addEventListener('click', (e)=>{
            e.stopPropagation()
            e.stopImmediatePropagation()

            console.log('clicked')
            console.log(e.target)
            if (e.target.getAttribute("data-has-function")) {
                console.log('it has function')
                let event = e.target.getAttribute("data-has-function")
                eval(event)(e)
            } else {
                console.log('it does not have function')
            }

            let curr_opened_menu = document.querySelectorAll('[data-clickmenuopened="true"]')
            let leftClickEvent = document.querySelectorAll('[data-leftclickevent]')

            if (e.target.getAttribute("data-editable-or-non-editable-mode") === "noneditable") {
                if (leftClickEvent.length > 0) {
                    for (let index = 0; index < leftClickEvent.length; index++) {
                        const element = leftClickEvent[index];
                        if (element.contains(e.target)) {
                            let event = element.getAttribute("data-leftclickevent")
                            eval(event)(e)
                        }
                    }
                }
            }

            if (curr_opened_menu.length > 0) {
                for (let index = 0; index < curr_opened_menu.length; index++) {
                    const element = curr_opened_menu[index];
                    if (element.contains(e.target)) {
                        // console.log('Clicked within myElement or its descendants');
                    } else {
                        // console.log('Clicked outside myElement');
                        element.setAttribute("data-clickmenuopened", "false")
                        element.style.display = "none"
                    }
                }
            }

        });
        
        const editableDiv = document.querySelector('.editabledivblock');

        // Focus the editable div element.
        editableDiv.focus();

        // Add an input event listener to the editable div.
        editableDiv.addEventListener('input', (e) => {
            console.log('yes input');
            console.log(e.target);
        });

    }, [])

    function addEditableDiv(){
        const mainDiv = document.getElementById("mainDiv");

        let div = document.createElement("div");
        div.setAttribute("contentEditable", true);
        div.setAttribute("data-what-it-became", "nothing")
        div.setAttribute("data-mode", "edit")
        div.setAttribute("data-contentbox", true)
        div.classList.add("border");
        div.classList.add("border-secondary");
        div.classList.add("editabledivblock");
        div.classList.add(styles.editablediv);
        div.id = parseInt(Math.random()*999999999999999)

        div.addEventListener("contextmenu", (e) => rightClickedEditableDiv(e));

        mainDiv.appendChild(div)
    }

    function makePopup(type){
        const selObj = window.getSelection();
        let selected = selObj.toString();
        if(selected.length == 0){
            selected = "button";
        }
        const range = selObj.getRangeAt(0);
        range.deleteContents();
        
        let span = document.createElement("span")

        if(type == 'button'){
            var popup = document.createElement("button");
            popup.classList.add("btn")
            popup.classList.add("btn-danger")

            // data-editable-or-non-editable-mode has two values: editable and noneditable
            popup.setAttribute("data-editable-or-non-editable-mode", "edit")
            popup.setAttribute("data-leftClickEvent", "modalForSavedPopupButton")

            popup.setAttribute("type", "button")
            popup.setAttribute("data-bs-toggle", "modal")
            popup.setAttribute("data-bs-target", "#exampleModal")


            popup.setAttribute("title", "hello this is title")
            popup.setAttribute("body", "this is body paragraph")
            popup.textContent = selected;
        }else if(type == "info"){
            var popup = document.createElement('span');
            popup.classList.add(styles.infobtn);
            popup.textContent = selected;
        }else{
            var popup = document.createElement('u')
            popup.classList.add(styles.underlineBtn)
            popup.textContent = selected
        }

        // listening click event to pass the title and body content
        popup.addEventListener("click", (e)=>{
            console.log('popup button clicked')
            setCurrentPopupElement(prev => e.target)
            setTitle(prev => e.target.getAttribute('title'))
            setBody(prev=>e.target.getAttribute("body"))
        })

        let space = document.createElement("span")
        space.innerHTML = "&nbsp;";

        span.append(popup)
        span.appendChild(space)
        
        range.insertNode(span);
    }

    function makeAccordion(){
        let selection = window.getSelection()
        let selectedText = selection.toString()
        if(selectedText.length > 0){
            let range = selection.getRangeAt(0)
            range.deleteContents()
            let accordionId = "accordionId-" + parseInt(Math.random() * 999999999)
            let collapseId = "collapseId-" + parseInt(Math.random() * 999999999)

            let accDiv = document.createElement("div")
            accDiv.classList.add("accordion")
            accDiv.id = accordionId

            let itemDiv = document.createElement("div")
            itemDiv.classList.add("accordion-item")

            let accHeader = document.createElement("h2")
            accHeader.classList.add("accordion-header")

            let headerButton = document.createElement("button")
            headerButton.classList.add("accordion-button")
            headerButton.classList.add("collapsed")
            headerButton.setAttribute("type", "button")
            headerButton.setAttribute("data-bs-toggle", "collapse")
            headerButton.setAttribute("data-bs-target", "#" + collapseId)
            headerButton.setAttribute("aria-expanded", "false")
            headerButton.setAttribute("aria-controls", collapseId)
            headerButton.innerHTML = "This is Heading"

            accHeader.append(headerButton)
            itemDiv.append(accHeader)

            let collapseDiv = document.createElement("div")
            collapseDiv.id = collapseId
            collapseDiv.classList.add("accordion-collapse")
            collapseDiv.classList.add("collapse")
            collapseDiv.classList.add("show")
            collapseDiv.setAttribute("data-bs-parent", accordionId)

            let accordionBodyDiv = document.createElement("div")
            accordionBodyDiv.classList.add("accordion-body")
            accordionBodyDiv.innerHTML = "this is body"

            collapseDiv.append(accordionBodyDiv)
            itemDiv.append(collapseDiv)

            let space = document.createElement("span")
            space.innerHTML = "&nbsp;";
            
            accDiv.append(itemDiv)
            accDiv.appendChild(space)

            range.insertNode(accDiv)
        }

    }

    // for popup
    function editableValue(e, type){
        if(type == 'title'){
            console.log('from editableValue: ', e.target)
            var changedTitle = e.target.innerHTML
            // console.log(e.target.innerHTML)
            // console.log(currentpopupelement)
            currentpopupelement.setAttribute("title", changedTitle)
        }
        if(type == 'body'){
            var changedBody = e.target.innerHTML
            currentpopupelement.setAttribute("body", changedBody)
        }
    }

    // quiz
    function QuizAnswer(question, defaultAnswer, callback){
        let ans = prompt(question, defaultAnswer)
        if(ans == "yes" || ans == "no"){
            callback(ans)
        }else{
            QuizAnswer(question, defaultAnswer, callback)
        }
    }

    function quizOptionButtonClicked(e) {
        e.stopPropagation();
        e.preventDefault();

        let ans = e.target.getAttribute("answer")
        let alert_type = null
        if(ans == 'yes'){
            doAlert('success', 'Correct')
        }else if(ans == 'no'){
            doAlert('danger', 'Wrong Answer')
        }

        function doAlert(type, text){
            let parent = e.target.parentElement;

            let alertDiv = document.createElement("div")
            alertDiv.classList.add("alert")
            alertDiv.classList.add("alert-" + type)
            alertDiv.classList.add(styles.fullFlexWidth)
            alertDiv.setAttribute("role", "alert")
            alertDiv.textContent = text

            parent.insertBefore(alertDiv, parent.firstChild);

            setTimeout(() => {
                alertDiv.remove()
            }, 1000)
        }
    }

    function quizRightClicked(e){
        e.preventDefault()
        e.stopPropagation();

        QuizAnswer("Is this an correct Answer \n 'yes' or 'no'", e.target.getAttribute("answer"), (ans) => {
            e.target.setAttribute("answer", ans)
        })
    }

    function quiz(){
        let selection = window.getSelection()
        let selectedText = selection.toString()
        if(selectedText.length > 0){
            let range = selection.getRangeAt(0)
            range.deleteContents()

            let quizCard = document.createElement("div")
            quizCard.classList.add("card")
            quizCard.classList.add("shadow")
            quizCard.classList.add("p-3")

            let quizQuestion = document.createElement("div")
            quizQuestion.setAttribute("contentEditable", "true")
            quizQuestion.innerHTML = "<h3>What is Question?</h3>"
            quizCard.append(quizQuestion)

            let hr = document.createElement("hr")
            quizCard.append(hr)

            let gap = document.createElement("div")
            gap.style.height = "8px"
            quizCard.append(gap)

            let quizOptionsDiv = document.createElement("div")
            quizOptionsDiv.classList.add(styles.quizOptions)

            // first option
            let quizOptionFirst = document.createElement("div")
            quizOptionFirst.setAttribute("data-leftClickEvent", "quizOptionButtonClicked")
            quizOptionFirst.setAttribute("data-rightClickEvent", "quizRightClicked")
            quizOptionFirst.setAttribute("data-editable-or-non-editable-mode", "edit")
            quizOptionFirst.setAttribute("answer", "no")
            quizOptionFirst.setAttribute("type", "button")
            quizOptionFirst.setAttribute("contentEditable", "true")
            quizOptionFirst.classList.add("btn")
            quizOptionFirst.classList.add("btn-outline-secondary")
            quizOptionFirst.textContent = "option 1"
            quizOptionsDiv.appendChild(quizOptionFirst)

            quizOptionFirst.addEventListener("contextmenu", (e)=>{
                e.preventDefault()
                e.stopPropagation()
                quizRightClicked(e)

            })

            quizOptionFirst.addEventListener("click", (e)=>{
                e.preventDefault()
                e.stopPropagation()
                quizOptionButtonClicked(e)

            })

            // second option
            let quizOptionSecond = document.createElement("div")
            quizOptionSecond.setAttribute("data-leftClickEvent", "quizOptionButtonClicked")
            quizOptionSecond.setAttribute("data-rightClickEvent", "quizRightClicked")
            quizOptionSecond.setAttribute("data-editable-or-non-editable-mode", "edit")
            quizOptionSecond.setAttribute("type", "button")
            quizOptionSecond.setAttribute("answer", "no")
            quizOptionSecond.setAttribute("contentEditable", "true")
            quizOptionSecond.classList.add("btn")
            quizOptionSecond.classList.add("btn-outline-secondary")
            quizOptionSecond.textContent = "option 2"
            quizOptionsDiv.appendChild(quizOptionSecond)

            quizOptionSecond.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                e.stopPropagation();
                quizRightClicked(e)

            })

            quizOptionSecond.addEventListener("click", (e) => {
                e.preventDefault()
                e.stopPropagation()
                quizOptionButtonClicked(e)

            })


            // third option
            let quizOptionThird = document.createElement("div")
            quizOptionThird.setAttribute("data-leftClickEvent", "quizOptionButtonClicked")
            quizOptionThird.setAttribute("data-rightClickEvent", "quizRightClicked")
            quizOptionThird.setAttribute("data-editable-or-non-editable-mode", "edit")
            quizOptionThird.setAttribute("type", "button")
            quizOptionThird.setAttribute("answer", "no")
            quizOptionThird.setAttribute("contentEditable", "true")
            quizOptionThird.classList.add("btn")
            quizOptionThird.classList.add("btn-outline-secondary")
            quizOptionThird.textContent = "option 3"
            quizOptionsDiv.appendChild(quizOptionThird)

            quizOptionThird.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                e.stopPropagation();
                quizRightClicked(e)

            })

            quizOptionThird.addEventListener("click", (e) => {
                e.preventDefault()
                e.stopPropagation()
                quizOptionButtonClicked(e)

            })


            // fourth option
            let quizOptionFourth = document.createElement("div")
            quizOptionFourth.setAttribute("data-leftClickEvent", "quizOptionButtonClicked")
            quizOptionFourth.setAttribute("data-rightClickEvent", "quizRightClicked")
            quizOptionFourth.setAttribute("data-editable-or-non-editable-mode", "edit")
            quizOptionFourth.setAttribute("type", "button")
            quizOptionFourth.setAttribute("answer", "no")
            quizOptionFourth.setAttribute("contentEditable", "true")
            quizOptionFourth.classList.add("btn")
            quizOptionFourth.classList.add("btn-outline-secondary")
            quizOptionFourth.textContent = "option 4"
            quizOptionsDiv.appendChild(quizOptionFourth)
            
            quizOptionFourth.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                e.stopPropagation();
                quizRightClicked(e)

            })

            quizOptionFourth.addEventListener("click", (e) => {
                e.preventDefault()
                e.stopPropagation()
                quizOptionButtonClicked(e)

            })

            quizCard.append(quizOptionsDiv)
            quizCard.append(gap)
            quizCard.append(hr)

            let quizExplainDiv = document.createElement("div")
            quizExplainDiv.setAttribute("contentEditable", true)

            let quizExplainButton = document.createElement("button")
            quizExplainButton.classList.add("btn")
            quizExplainButton.classList.add("btn-outline-info")

            quizExplainButton.setAttribute("type", "button")

            // triggering modal
            // quizExplainButton.setAttribute("data-bs-toggle", "modal");
            // quizExplainButton.setAttribute("data-bs-target", "#exampleModal");

            // quizExplainButton.addEventListener("click", () => {
            //     // Trigger the modal programmatically
            //     let modal = new bootstrap.Modal(document.getElementById("exampleModal"));
            //     modal.show();
            // });

            quizExplainButton.setAttribute("data-editable-or-non-editable-mode", "edit")
            quizExplainButton.setAttribute("data-has-function", "quizExplanationButtonClicked")

            quizExplainButton.setAttribute("title", "hello this is title")
            quizExplainButton.setAttribute("body", "this is body paragraph")

            quizExplainButton.textContent = "Explanation"

            // listening click event to pass the title and body content
            quizExplainButton.addEventListener("click", (e) => quizExplanationButtonClicked(e))

            quizExplainDiv.append(quizExplainButton)

            quizCard.append(quizExplainDiv)

            let space = document.createElement("span")
            space.innerHTML = "&nbsp;";

            // quizCard.appendChild(space)

            range.insertNode(space)
            range.insertNode(quizCard)
        }
    }

    // quiz explanation button clicked
    function quizExplanationButtonClicked(e){
        setCurrentPopupElement(prev => e.target)
        setTitle(prev => e.target.getAttribute('title'))
        setBody(prev => e.target.getAttribute("body"))

        let modal = new bootstrap.Modal(document.getElementById("exampleModal"));

        if (e.target.getAttribute("data-editable-or-non-editable-mode") == "edit") {
            let modalTitleDiv = document.getElementById("modalTitleDiv")
            let modalBodyDiv = document.getElementById("modalBodyDiv")

            modalTitleDiv.setAttribute("contentEditable", true)
            modalBodyDiv.setAttribute("contentEditable", true)
        }

        modal.show();
    }

    // image slider
    function imageSlider(){
        let selection = window.getSelection()
        let selectedText = selection.toString()

        if(selectedText.length > 0){
            let range = selection.getRangeAt(0)
            // range.deleteContents()
            
        }else{
            let sidebar = document.querySelector("#staticBackdrop")

            let h1 = document.createElement("h1")
            h1.classList.add('p-3')
            h1.textContent = "Nothing selected, select something you idiot (:"

            sidebar.insertBefore(h1, sidebar.firstChild)
        }
    }

    // for image slider
    function addSlider(){

        console.log('from add slider')

        let menu = document.getElementById("rightoptionmenu")
        let idOfThatEditableDiv = menu.getAttribute("data-whichdiv") //trying to get id of the editable div: will set this id in each element of the slider like image, title, description: later helps to find & connect two of them i.e. all the slider items belongings to that editable div.
        console.log('id of that editable div: ', idOfThatEditableDiv)

        let sidebarBody = document.querySelector(".offcanvas-body")
        let el = sliderElement(idOfThatEditableDiv)

        sidebarBody.insertBefore(el, sidebarBody.lastChild)
    }

    // slider element
    const sliderElement = (idOfThatEditableDiv)=>{
        let div = document.createElement("div");
        // div.setAttribute("contentEditable", true);
        let id = parseInt(Math.random() * 999999999999999);
        div.setAttribute("data-slider-of-which-div", idOfThatEditableDiv)
        div.setAttribute("data-sliderparent", id)
        div.classList.add("border");
        div.classList.add("border-light");
        div.classList.add(styles.sliderMainDiv);

        let closeButton = document.createElement("button")
        closeButton.classList.add(styles.sliderItem)
        closeButton.classList.add(styles.sliderCloseButton)
        closeButton.classList.add('btn-close')
        closeButton.setAttribute("type", "button")
        closeButton.setAttribute("aria-label", "Close")
        div.appendChild(closeButton)
        
        closeButton.addEventListener("click", (e)=>{
            div.remove()
        })

        // image input element
        let selectImg = document.createElement("input")
        selectImg.classList.add(styles.sliderItem);
        selectImg.setAttribute("type", "file")
        selectImg.style.cursor="pointer"
        div.appendChild(selectImg)
        
        let imgBox = document.createElement("div")
        imgBox.classList.add(styles.sliderItem);
        imgBox.classList.add(styles.sliderImgBoxDiv)

        let imgTag = document.createElement("img")
        imgTag.classList.add(styles.sliderImageInBox)
        imgTag.setAttribute("data-sliderimage", id)
        imgTag.setAttribute("data-has-file", "false")
        imgTag.src = process.env.PUBLIC_URL + '/logo512.png'
        imgBox.append(imgTag)
        div.appendChild(imgBox)
        
        // TODO: on_submit: upload image on server and: show slider fetching from server. on_delete: remove previous image. after uploaded, do: 'choose file' button disabled and: edit|delete enabled.
        selectImg.addEventListener("change", (e) => {
            // console.log(e.target.files[0])
            let imgUrl = URL.createObjectURL(e.target.files[0])
            imgTag.src = imgUrl;
            imgTag.setAttribute("data-has-file", "true")
            imgTag.setAttribute("data-file-url", imgUrl)
        })

        let titleInput = document.createElement("input")
        titleInput.classList.add('form-control')
        titleInput.classList.add(styles.sliderItem)
        titleInput.setAttribute("data-slidertitle", id)
        titleInput.setAttribute("type", "text")
        titleInput.setAttribute("placeholder", "Title")
        div.appendChild(titleInput)
        
        let description = document.createElement("textarea")
        description.classList.add('form-control')
        description.classList.add(styles.sliderItem)
        description.setAttribute("data-sliderdescription", id)
        description.setAttribute("placeholder", "Description")
        description.setAttribute("rows", "3")
        div.appendChild(description)

        return div
    }

    // submit slider
    function submitSlider(e) {
        let mode = e.target.getAttribute("data-mode")

        let menu = document.getElementById("rightoptionmenu")
        let idOfThatEditableDiv = menu.getAttribute("data-whichdiv")
        let editableDiv = document.getElementById(idOfThatEditableDiv)

        let allItems = document.querySelectorAll(`[data-slider-of-which-div="${idOfThatEditableDiv}"]`)
        console.log('submitted')
        
        let imageSource = []
        let carouselTitle = []
        let carouselDescription = []
        let count = 0

        for(let i=0; i<allItems.length; i++){
            count++;
            let el = allItems[i]
            let el_id = el.getAttribute("data-sliderparent");

            let imageEl = document.querySelector(`[data-sliderimage="${el_id}"]`)
            let titleInputEl = document.querySelector(`[data-slidertitle="${el_id}"]`)
            let titleDescEl = document.querySelector(`[data-sliderdescription="${el_id}"]`)

            let imgSrc = imageEl.getAttribute("src");
            let title = titleInputEl.value;
            let description = titleDescEl.value;
            // if(imageEl.getAttribute("data-has-file") == "false"){
            //     imgSrc = imageEl.getAttribute("")
            // }

            let carouselSection = document.getElementById("carouselSection")

            imageSource.push(imgSrc)
            carouselTitle.push(title)
            carouselDescription.push(description)


            console.log('src: ', imgSrc)
            console.log('title: ', title)
            console.log('desc: ', description)
        }

        let carouselElementDiv = carouselElement(count, imageSource, carouselTitle, carouselDescription);

        editableDiv.removeAttribute("contentEditable")
        
        // delete all child elements of editable div if mode is edit
        if(mode == "edit"){
            while (editableDiv.firstChild) {
                editableDiv.removeChild(editableDiv.firstChild);
            }
        }

        editableDiv.append(carouselElementDiv)
        editableDiv.setAttribute("data-what-it-became", "carousel")

        // storing information of carousels in an editable div
        editableDiv.setAttribute("data-total-carousel", count)
        editableDiv.setAttribute("data-carousel-title", carouselTitle)
        editableDiv.setAttribute("data-carousel-description", carouselDescription)
        editableDiv.setAttribute("data-carousel-image", imageSource)

        let sidebarBody = document.querySelector(".offcanvas-body")
        // remove child elements inside sidebarBody except last child
        while (sidebarBody.firstChild) {
            if(sidebarBody.firstChild != sidebarBody.lastChild){
                sidebarBody.removeChild(sidebarBody.firstChild);
            }else{
                break;
            }
        }

        let sidebarClose = document.getElementById("sidebarclosebutton")
        sidebarClose.click()
        
        // set submit data-mode to normal
        e.target.setAttribute("data-mode", "normal")

        console.log('id of editableDiv: ', idOfThatEditableDiv)
        console.log('editableDiv: ', editableDiv)
        console.log('the end')
    }

    // carousel element
    function carouselElement(nth, imageSrc, title, description){
        let id = 'carousel'+parseInt(Math.random()*999999999999999)+'id';
        let mainDiv = document.createElement("div");
        mainDiv.id = id;
        mainDiv.classList.add("carousel")
        mainDiv.classList.add("carousel-dark")
        mainDiv.classList.add("slide")
        mainDiv.setAttribute("data-bs-ride", "carousel")

        // carousel indicators
        let carIndicatorDiv = document.createElement("div");
        carIndicatorDiv.classList.add("carousel-indicators");

        // indicators
        for(let i=0;i<nth;i++){
            let indicatorButton = document.createElement("button");
            indicatorButton.setAttribute("type", "button");
            indicatorButton.setAttribute("data-bs-target", `#${id}`);
            indicatorButton.setAttribute("data-bs-slide-to", `${i}`);
            indicatorButton.setAttribute("aria-current", `true`);
            indicatorButton.setAttribute("aria-label", `Slide ${i+1}`);
            if(i == 0){
                indicatorButton.classList.add("active");
            }
            carIndicatorDiv.appendChild(indicatorButton);
        }

        let carouselInnerDiv = document.createElement("div")
        carouselInnerDiv.classList.add("carousel-inner")

        // items
        for(let ind=0;ind<nth;ind++){
            let carouselItem = document.createElement("div")
            carouselItem.setAttribute("data-bs-interval", "3000");
            carouselItem.classList.add("carousel-item")
            if(ind == 0){
                carouselItem.classList.add("active")
            }

            // image
            let imgDiv = document.createElement("div")
            imgDiv.classList.add(styles.carouselImgDiv)
            let imgTag = document.createElement("img")
            imgTag.setAttribute("src", imageSrc[ind])
            imgTag.classList.add(styles.carouselImg)
            imgDiv.appendChild(imgTag)
            carouselItem.appendChild(imgDiv)

            // caption
            let captionDiv = document.createElement("div")
            captionDiv.classList.add("carousel-caption")
            captionDiv.classList.add("text-white")
            captionDiv.classList.add("d-none")
            captionDiv.classList.add("d-md-block")
            carouselItem.appendChild(captionDiv)

            // caption title and description
            let captionTitle = document.createElement("h5")
            captionTitle.textContent = title[ind]
            let captionDesc = document.createElement("p")
            captionDesc.textContent = description[ind]
            captionDiv.appendChild(captionTitle)
            captionDiv.appendChild(captionDesc)
         
            carouselInnerDiv.appendChild(carouselItem)
        }

        mainDiv.appendChild(carIndicatorDiv)
        mainDiv.appendChild(carouselInnerDiv)

        // controls
        let prevButton = document.createElement("button")
        prevButton.classList.add("carousel-control-prev")
        prevButton.setAttribute("type", "button")
        prevButton.setAttribute("data-bs-target", `#${id}`)
        prevButton.setAttribute("data-bs-slide", "prev")
        mainDiv.appendChild(prevButton)

        let prevButtonSpan = document.createElement("span")
        prevButtonSpan.classList.add("carousel-control-prev-icon")
        prevButtonSpan.setAttribute("aria-hidden", "true")
        prevButton.appendChild(prevButtonSpan)

        let prevButtonSpan2 = document.createElement("span")
        prevButtonSpan2.classList.add("visually-hidden")
        prevButtonSpan2.textContent = "Previous"
        prevButton.appendChild(prevButtonSpan2)

        let nextButton = document.createElement("button")
        nextButton.classList.add("carousel-control-next")
        nextButton.setAttribute("type", "button")
        nextButton.setAttribute("data-bs-target", `#${id}`)
        nextButton.setAttribute("data-bs-slide", "next")
        mainDiv.appendChild(nextButton)

        let nextButtonSpan = document.createElement("span")
        nextButtonSpan.classList.add("carousel-control-next-icon")
        nextButtonSpan.setAttribute("aria-hidden", "true")
        nextButton.appendChild(nextButtonSpan)

        let nextButtonSpan2 = document.createElement("span")
        nextButtonSpan2.classList.add("visually-hidden")
        nextButtonSpan2.textContent = "Next"
        nextButton.appendChild(nextButtonSpan2)

        // let mainDivSpace = document.createElement("span")
        // mainDivSpace.innerHTML = "&nbsp;"
        // mainDiv.appendChild(mainDivSpace)

        return mainDiv
    }

    // main editable div Right Clicked
    function rightClickedEditableDiv(e){
        e.preventDefault()
        console.log('right clicked')
        // what is the difference between e.target and e.currentTarget?
        // e.target is the element that triggered the event (e.g., the user clicked on)
        // e.currentTarget is the element that the event listener is attached to.
        let self = e.currentTarget
        let whatItBecame = self.getAttribute("data-what-it-became")
        console.log('whatItBecame', whatItBecame)

        if (whatItBecame === "carousel") {
            let carouselOption = document.getElementById("carouselOptionDiv")
            carouselOption.textContent = "Edit Carousel"
            carouselOption.setAttribute("data-what-mode", "edit")
            carouselOption.setAttribute("data-editableDivId", self.id)

            // make carousel submit button mode edit
            let submitButton = document.getElementById("imageslidersubmitbutton")
            submitButton.setAttribute("data-mode", "edit")

            let deleteOption = document.getElementById("deleteOptionDiv")
            deleteOption.textContent = "Delete Carousel"
        }else{
            let carouselOption = document.getElementById("carouselOptionDiv")
            carouselOption.textContent = "create Carousel"
            carouselOption.setAttribute("data-what-mode", "normal")

            let deleteOption = document.getElementById("deleteOptionDiv")
            deleteOption.textContent = "Delete"
        }

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        let menu = document.getElementById("rightoptionmenu")

        menu.style.display = 'block'
        menu.style.top = mouseY+"px"
        menu.style.left = mouseX+"px"
        menu.setAttribute("data-clickmenuopened", 'true')
        menu.setAttribute("data-whichdiv", self.id)

        const carouselMenuElement = menu.querySelector('.carouselmenu');
        
        console.log('right clicked')
        console.log('e.target: ', e.target)
        console.log('right option: ', menu)
        console.log('carousel Menu: ', carouselMenuElement)
        console.log('x: ', mouseX)
        console.log('y: ', mouseY)
    }

    // delete Editable Div
    function deleteEditableDiv(e){
        console.log('deleting')

        let optionmenu = e.target.parentElement
        let deleteDiv = document.getElementById(optionmenu.getAttribute("data-whichdiv"))
        deleteDiv.remove()

        optionmenu.style.display = "none"
    }

    // arr[i][index] remove it. 

    // carousel menu clicked
    function carouselMenuGotClicked(e){
        console.log('e.target: ', e.target)
        e.preventDefault()
        let optionmenu = e.target.parentElement
        optionmenu.style.display = "none"

        let whatMode = e.target.getAttribute("data-what-mode")

        if(whatMode == "edit"){
            console.log('edit carousel clicked')
            let editableDivId = e.target.getAttribute("data-editableDivId")
            let editableDiv = document.getElementById(editableDivId)

            let totalCarousel = parseInt(editableDiv.getAttribute("data-total-carousel"))
            let carouselTitle = editableDiv.getAttribute("data-carousel-title")
            let carouselDescription = editableDiv.getAttribute("data-carousel-description")
            let carouselImage = editableDiv.getAttribute("data-carousel-image")

            let sidebarBody = document.querySelector(".offcanvas-body")

            console.log('carouselImage: ', carouselImage)
            for(let i=0; i<totalCarousel; i++){
                // console.log('carouselImage inside loop: ', carouselImage[i])
                


                let el = sliderElement(editableDivId)
                console.log('el: ', el)

                let el_parent_id = el.getAttribute("data-sliderparent")

                let imgTag = el.querySelector(`[data-sliderimage="${el_parent_id}"]`)
                imgTag.src = totalCarousel > 1 ? carouselImage.split(",")[i] : carouselImage

                let titleInput = el.querySelector(`[data-slidertitle="${el_parent_id}"]`)
                titleInput.value = totalCarousel > 1 ? carouselTitle.split(",")[i] : carouselTitle
                // titleInput.value = carouselTitle[i]

                let description = el.querySelector(`[data-sliderdescription="${el_parent_id}"]`)
                description.value = totalCarousel > 1 ? carouselDescription.split(",")[i] : carouselDescription
                // description.value = carouselDescription[i]

                sidebarBody.insertBefore(el, sidebarBody.lastChild)
            }
            
            // let el = sliderElement(editableDivId)

            // console.log('slider element: ', el);

            // sidebarBody.insertBefore(el, sidebarBody.lastChild)
        }
    }

    // sidebar close button clicked
    function sideBarCloseButtonClicked(e){
        let sidebarBody = document.querySelector(".offcanvas-body")
        // remove child elements inside sidebarBody except last child
        while (sidebarBody.firstChild) {
            if (sidebarBody.firstChild != sidebarBody.lastChild) {
                sidebarBody.removeChild(sidebarBody.firstChild);
            } else {
                break;
            }
        }
    }

    // save editable div
    function savedEditableDiv() {
        let mainDiv = document.getElementById("mainDiv");
        let mainDivCopy = mainDiv.cloneNode(true);
        let lastdiv = document.querySelector(".lastdiv");

        let getAllDatabaseMode = mainDivCopy.querySelectorAll("[data-editable-or-non-editable-mode]")
        getAllDatabaseMode.forEach((el) => {
            el.setAttribute("data-editable-or-non-editable-mode", "noneditable")
        })

        let getAllContentEditable = mainDivCopy.querySelectorAll("[contentEditable]")
        getAllContentEditable.forEach((el) => {
            el.setAttribute("contentEditable", false)
        })

        let fetchedData = mainDivCopy.innerHTML.toString()

        // remove all the child from lastdiv
        while (lastdiv.firstChild) {
            lastdiv.removeChild(lastdiv.firstChild);
        }
    
        lastdiv.innerHTML = fetchedData
    }

    // modal for saved popup button
    function modalForSavedPopupButton(e){
        let title = e.target.getAttribute("title")
        let body = e.target.getAttribute("body")

        let modalTitle = document.querySelector(".modal-title")
        let modalBody = document.querySelector(".modal-body")

        modalTitle.innerHTML = title
        modalBody.innerHTML = body
    }

  return (
    <div>
        {/* feature */}
        <div className={'border border-secondary sticky-top bg-dark ' + styles.featureDiv}>

              <div className=''>
                  <button type="button" className="btn btn-secondary" data-bs-toggle="popover" data-bs-title="Popover title" data-bs-content="And here's some amazing content. It's very engaging. Right?">popover</button>
              </div>
              
            {/* heading tag */}
            <div className={'btn btn-secondary dropdown ' + styles.featureItems} >
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Heading
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#"><h1>H1</h1></a></li>
                    <li><a className="dropdown-item"><h2>H2</h2></a></li>
                    <li><a className="dropdown-item"><h3>H3</h3></a></li>
                    <li><a className="dropdown-item"><h4>H4</h4></a></li>
                    <li><a className="dropdown-item"><h5>H5</h5></a></li>
                    <li><a className="dropdown-item"><h6>H6</h6></a></li>
                </ul>
            </div>

            {/* popup */}
            <div className="btn-group ">
                <button onClick={()=>makePopup('button')} type="button" className="btn btn-secondary">popup</button>
                <button type="button" className="btn btn-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown" aria-expanded="false">
                    <span className="visually-hidden">Toggle Dropdown</span>
                </button>
                <ul className="dropdown-menu">
                    <li onClick={()=>makePopup('button')}><a className="dropdown-item" href="#">button</a></li>
                    <li onClick={()=>makePopup('underline')}><a className="dropdown-item" href="#">under line</a></li>
                    <li><a className="dropdown-item" href="#">Something</a></li>
                    <li><a className="dropdown-item" href="#">Separated link</a></li>
                </ul>
            </div>

            {/* Accordion */}
              <button onClick={makeAccordion} className={'btn btn-secondary ' + styles.featureItems}>Accordion</button>

            {/* quiz */}
            <button onClick={quiz} className={'btn btn-secondary ' + styles.featureItems}>quiz</button>

              {/* Image Slider */}
              {/* onClick={imageSlider} */}
              <button className={'btn btn-secondary ' + styles.featureItems} type="button" data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">Slider</button>
        </div>

        {/* editor */}
        <div className={'border border-secondary ' + styles.main } id='mainDiv'>
            <div id={parseInt(Math.random() * 999999999999999)} data-contentbox onContextMenu={rightClickedEditableDiv} contentEditable data-what-it-became="nothing" data-mode="edit" className={'border border-secondary editabledivblock '+styles.editablediv}></div>
        </div>

        {/* add more button */}
        <button onClick={addEditableDiv} className={'btn btn-primary ' + styles.addButton}>Add</button>
        <button onClick={savedEditableDiv} className={'btn btn-success m-3 ' + styles.addButton}>Save</button>


        {/* SideBar */}
          <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
              <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="staticBackdropLabel">Offcanvas</h5>
                  <button onClick={sideBarCloseButtonClicked} id='sidebarclosebutton' type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                  <div className="my-3">
                      <button onClick={addSlider} className='btn btn-primary'>Add Slider</button>
                      <button id='imageslidersubmitbutton' data-mode="normal" data-tempid="" onClick={submitSlider} className='ms-3 btn btn-success'>Submit</button>
                  </div>
              </div>
          </div>

        {/* Modal content */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <div onInput={(e) => editableValue(e, 'title')} suppressContentEditableWarning className={styles.modalTitleDiv} id='modalTitleDiv'>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            <div dangerouslySetInnerHTML={{ __html: title }} />
                        </h1>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div onInput={(e)=>editableValue(e, 'body')} suppressContentEditableWarning className="modal-body" id='modalBodyDiv'>
                    <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

        {/* right clicked options */}
          <div id='rightoptionmenu' data-clickmenuopened='false' data-whichdiv="" className={styles.rightOptionMain}>

            <div id='carouselOptionDiv' onClick={carouselMenuGotClicked} data-what-mode="normal" className='carouselmenu' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">create Carousel</div>

            <div id='deleteOptionDiv' onClick={deleteEditableDiv}>Delete</div>
        </div>

        <br></br>
        <div className="m-3 lastdiv"></div>

    </div>
  )
}

export default Editor
