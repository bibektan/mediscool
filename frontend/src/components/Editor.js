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

        // for mouse click
        window.addEventListener('click', (e)=>{

            let curr_opened_menu = document.querySelectorAll('[data-clickmenuopened="true"]')

            for (let index = 0; index < curr_opened_menu.length; index++) {
                const element = curr_opened_menu[index];
                if(element.contains(e.target)){
                    console.log('Clicked within myElement or its descendants');
                } else {
                    console.log('Clicked outside myElement');
                    element.setAttribute("data-clickmenuopened", "false")
                    element.style.display = "none"
                }
            }

            console.log('clicked')
            console.log(curr_opened_menu.length)
            console.log(curr_opened_menu)
        })

        const editableDiv = document.querySelector('.editabledivblock');

        // Create an input event object.
        // const inputEvent = new Event('input');

        // Focus the editable div element.
        editableDiv.focus();

        // Enable the editable div element.
        // editableDiv.disabled = false;

        // Make the editable div element visible.
        // editableDiv.style.display = 'block';

        // Dispatch the input event to the editable div.
        // editableDiv.dispatchEvent(inputEvent);

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
        div.classList.add("border");
        div.classList.add("border-secondary");
        div.classList.add(styles.editablediv);

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
            setCurrentPopupElement(prev => popup)
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
            quizOptionFirst.setAttribute("answer", "no")
            quizOptionFirst.setAttribute("type", "button")
            quizOptionFirst.setAttribute("contentEditable", "true")
            quizOptionFirst.classList.add("btn")
            quizOptionFirst.classList.add("btn-outline-secondary")
            quizOptionFirst.textContent = "option 1"
            quizOptionsDiv.appendChild(quizOptionFirst)

            quizOptionFirst.addEventListener("contextmenu", (e)=>{
                e.preventDefault()

                QuizAnswer("Is this an correct Answer \n 'yes' or 'no'", e.target.getAttribute("answer") , (ans)=>{
                    e.target.setAttribute("answer", ans)
                })
            })

            quizOptionFirst.addEventListener("click", (e)=>{
                quizOptionButtonClicked(e)
            })

            // second option
            let quizOptionSecond = document.createElement("div")
            quizOptionSecond.setAttribute("type", "button")
            quizOptionSecond.setAttribute("answer", "no")
            quizOptionSecond.setAttribute("contentEditable", "true")
            quizOptionSecond.classList.add("btn")
            quizOptionSecond.classList.add("btn-outline-secondary")
            quizOptionSecond.textContent = "option 2"
            quizOptionsDiv.appendChild(quizOptionSecond)

            quizOptionSecond.addEventListener("contextmenu", (e) => {
                e.preventDefault()

                QuizAnswer("Is this an correct Answer \n 'yes' or 'no'", e.target.getAttribute("answer"), (ans) => {
                    e.target.setAttribute("answer", ans)
                })
            })

            quizOptionSecond.addEventListener("click", (e) => {
                quizOptionButtonClicked(e)
            })


            // third option
            let quizOptionThird = document.createElement("div")
            quizOptionThird.setAttribute("type", "button")
            quizOptionThird.setAttribute("answer", "no")
            quizOptionThird.setAttribute("contentEditable", "true")
            quizOptionThird.classList.add("btn")
            quizOptionThird.classList.add("btn-outline-secondary")
            quizOptionThird.textContent = "option 3"
            quizOptionsDiv.appendChild(quizOptionThird)

            quizOptionThird.addEventListener("contextmenu", (e) => {
                e.preventDefault()

                QuizAnswer("Is this an correct Answer \n 'yes' or 'no'", e.target.getAttribute("answer"), (ans) => {
                    e.target.setAttribute("answer", ans)
                })
            })

            quizOptionThird.addEventListener("click", (e) => {
                quizOptionButtonClicked(e)
            })


            // fourth option
            let quizOptionFourth = document.createElement("div")
            quizOptionFourth.setAttribute("type", "button")
            quizOptionFourth.setAttribute("answer", "no")
            quizOptionFourth.setAttribute("contentEditable", "true")
            quizOptionFourth.classList.add("btn")
            quizOptionFourth.classList.add("btn-outline-secondary")
            quizOptionFourth.textContent = "option 4"
            quizOptionsDiv.appendChild(quizOptionFourth)
            
            quizOptionFourth.addEventListener("contextmenu", (e) => {
                e.preventDefault()

                QuizAnswer("Is this an correct Answer \n 'yes' or 'no'", e.target.getAttribute("answer"), (ans) => {
                    e.target.setAttribute("answer", ans)
                })
            })

            quizOptionFourth.addEventListener("click", (e) => {
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
            quizExplainButton.textContent = "Explanation"

            quizExplainDiv.append(quizExplainButton)

            quizCard.append(quizExplainDiv)

            let space = document.createElement("span")
            space.innerHTML = "&nbsp;";

            // quizCard.appendChild(space)

            range.insertNode(space)
            range.insertNode(quizCard)
        }
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

        let canva = document.querySelector(".offcanvas-body")
        let el = sliderElement()

        canva.insertBefore(el, canva.lastChild)
    }

    // submit slider
    function submitSlider(){

    }

    // slider element
    const sliderElement = ()=>{
        let div = document.createElement("div");
        // div.setAttribute("contentEditable", true);
        let id = parseInt(Math.random() * 999999999999999) ;
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

    // main editable div Right Clicked
    function rightClickedEditableDiv(e){
        e.preventDefault()
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        let menu = document.getElementById("rightoptionmenu")
        menu.style.display = 'block'
        menu.style.top = mouseY+"px"
        menu.style.left = mouseX+"px"
        menu.setAttribute("data-clickmenuopened", 'true')
        
        console.log('right clicked')
        console.log(e.target)
        console.log('x: ', mouseX)
        console.log('y: ', mouseY)
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
                <button onClick={()=>makePopup('info')} type="button" className="btn btn-secondary">popup</button>
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
            <div onContextMenu={rightClickedEditableDiv} contentEditable className={'border border-secondary editabledivblock '+styles.editablediv}></div>
        </div>

        {/* add more button */}
        <button onClick={addEditableDiv} className={'btn btn-primary ' + styles.addButton}>Add</button>


        {/* SideBar */}
          <div className="offcanvas offcanvas-start" data-bs-backdrop="static" tabIndex="-1" id="staticBackdrop" aria-labelledby="staticBackdropLabel">
              <div className="offcanvas-header">
                  <h5 className="offcanvas-title" id="staticBackdropLabel">Offcanvas</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                  <div className="my-3">
                      <button onClick={addSlider} className='btn btn-primary'>Add Slider</button>
                      <button id='imageslidersubmitbutton' data-tempid="" onClick={submitSlider} className='ms-3 btn btn-success'>Submit</button>
                  </div>
              </div>
          </div>

        {/* Modal content */}
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                <div className="modal-header">
                    <div onInput={(e) => editableValue(e, 'title')} contentEditable suppressContentEditableWarning className={styles.modalTitleDiv}>
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                            <div dangerouslySetInnerHTML={{ __html: title }} />
                        </h1>
                    </div>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div onInput={(e)=>editableValue(e, 'body')} contentEditable suppressContentEditableWarning className="modal-body">
                    <div dangerouslySetInnerHTML={{ __html: body }} />
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
                </div>
            </div>
        </div>

        {/* right clicked options */}
          <div id='rightoptionmenu' data-clickmenuopened='false' className={styles.rightOptionMain}>
            <div className='carouselmenu' data-bs-toggle="offcanvas" data-bs-target="#staticBackdrop" aria-controls="staticBackdrop">Carousel</div>
            <div>hello 2</div>
            <div>hello 3</div>
            <div>hello 4</div>
            <div>hello 5</div>
        </div>

    </div>
  )
}

export default Editor