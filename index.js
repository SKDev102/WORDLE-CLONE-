const letterBox = document.querySelectorAll(".letterBox")
const answerBox = document.getElementById("AnswerBox")

let ROW = 0
let correctword
let arr
const greenColor = "rgb(93, 222, 93)"
const yellowColor = "rgb(225, 223, 89)"
const greyColor = "rgb(52, 54, 55)"


async function generateCorrectWord()
{
    const file = await fetch('./4-letter-words-processed-new.txt')
    const text = await file.text()

    words = text
        .split(/\r?\n/)
        .map(word => word.trim().toUpperCase())
        .filter(word => /^[A-Z]{4}$/.test(word));
    
    const randomIndex = Math.floor(Math.random() * words.length)
    const genWord = words[randomIndex]
    const checkArr = Array(256).fill(0)
    for(let i=0; i<genWord.length; i++)
    {
        checkArr[genWord.charCodeAt(i)] += 1
    }
    return [genWord, checkArr]
}

function updateRow(ROW)
{
    letterBox.forEach((row, rowindex)=> {
        const inputBox = row.querySelectorAll("input")
        inputBox.forEach((input, index) => {
            input.disabled = rowindex != ROW
            if(rowindex == ROW && index == 0)
            {
                inputBox[index].focus()
            }
        })
    })
}

function rowOP(ROW)
{
    const inputBox = [...letterBox[ROW].querySelectorAll("input")]
    inputBox.forEach((input, index) => {
        input.addEventListener("input", () => {
            input.value = input.value.replace(/[^a-z]/gi, "").slice(0, 1).toUpperCase();
            if(input.value && inputBox[index+1])
            {
                inputBox[index+1].focus()
            }
        })

        input.addEventListener("keydown", event => {
            if (event.key == "Enter")
            {
                checkAnswer()
            }
        })

        input.addEventListener("keydown", event => {
            if(event.key == "Backspace"){
                event.preventDefault()
                if(input.value)
                {
                    input.value = ""
                }
                else if(inputBox[index-1])
                {
                    inputBox[index-1].value = ""
                    inputBox[index-1].focus()
                }
            }
            if (event.key == "ArrowLeft" && inputBox[index-1])
            {
                inputBox[index-1].focus()
            }
            if(event.key == "ArrowRight" && inputBox[index+1])
            {
                inputBox[index+1].focus()
            }
        })
    })
}


rowOP(ROW)
updateRow(ROW)
generateCorrectWord().then(result =>{
    [correctword, arrOriginal] = result
})

function checkAnswer()
{
    const arr = [...arrOriginal]
    let letterList = [...correctword]

    const inputBox = letterBox[ROW]
    const current = inputBox.querySelectorAll("input")
    let rowanswer = ""
    current.forEach(input => {
        rowanswer += input.value
    })
    if (rowanswer.length != 4)
    {
        answerBox.textContent = `The word contains 4 letter not ${rowanswer.length}`
        return
    }

    if(rowanswer == correctword)
    {
        /*
        const correctRow = inputBox.querySelectorAll("input")
        correctRow.forEach(input => {
            input.style.backgroundColor = greenColor
            input.style.color = "white"
        })
            */
        changeColor(correctword, rowanswer, arr, current)
        answerBox.textContent= "Correct"

        return
    }
    else
    {
        changeColor(correctword, rowanswer, arr, current)
        if(ROW == 3)
        {
            answerBox.textContent = `Incorrect, the answer is ${correctword}`
        }
        else
        {
            answerBox.textContent = `Incorrect`
        }
    }
    ROW++
    updateRow(ROW)
    rowOP(ROW)
}


function changeColor(correctword, rowanswer, arr, current)
{
    for (let i = 0; i < 4; i++)
    {
        if (correctword[i] == rowanswer[i])
        {
            current[i].style.backgroundColor = greenColor;
            arr[rowanswer.charCodeAt(i)]--;
        }
        else if(arr[rowanswer.charCodeAt(i)] > 0)
        {
            current[i].style.backgroundColor = yellowColor;
            arr[rowanswer.charCodeAt(i)]--;
        }
        else
        {
            current[i].style.backgroundColor = greyColor;
        }
        console.log(`${rowanswer[i]} - ${arr[rowanswer.charCodeAt(i)]}`)
        current[i].style.color = "white";
    }
}