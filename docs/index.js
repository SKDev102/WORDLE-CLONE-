const letterBox = document.querySelectorAll(".letterBox")
const answerBox = document.getElementById("AnswerBox")
const startBtn = document.getElementById("startBtn")
const gameArea = document.getElementById("gameArea")
const newgameBtn = document.getElementById("newgameBtn")


let ROW = 0
let correctword
let arrOriginal = []
const greenColor = "rgb(93, 222, 93)"
const yellowColor = "rgb(225, 223, 89)"
const greyColor = "rgb(52, 54, 55)"
let words
const MAX_ROW = 5
const MAX_COL = 5

async function generateWordList()
{
    const file = await fetch('./5-letters.txt')
    const text = await file.text()

    words = text
        .split(/\r?\n/)
        .map(word => word.trim().toUpperCase())
        .filter(word => /^[A-Z]{5}$/.test(word));
}
generateWordList()

function getRandomWord()
{
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

function updateWinLoss(ROW)
{   
    letterBox[ROW].querySelectorAll("input").forEach(input => {
        input.disabled = true
    })
}

function rowOP()
{
    letterBox.forEach((row, rowindex) => {
        const inputBox = [...row.querySelectorAll("input")]
        inputBox.forEach((input, index) => {
            input.addEventListener("input", () => {
                if(rowindex != ROW) return;
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
                if(rowindex != ROW) return;
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
    })
}
rowOP()
/*
rowOP(ROW)
updateRow(ROW)
generateCorrectWord().then(result =>{
    [correctword, arrOriginal] = result
})
    */

async function startGame()
{
    gameArea.hidden = false
    startBtn.hidden = true
    newgameBtn.hidden = true
    ROW = 0

    letterBox.forEach(row => {
        row.querySelectorAll("input").forEach(input =>{
            input.value = ""
            input.style.backgroundColor = ""
            input.style.color = ""
        })
    })

    answerBox.textContent = "Enter your guess"

    try{
        if(!words || words.length == 0)
        {
            await generateWordList()
        }
        [correctword, arrOriginal] = getRandomWord()
        updateRow(ROW)
    }
    catch(error)
    {
        console.error(error);
    }
}

startBtn.addEventListener("click", startGame)


function checkAnswer()
{
    const arr = [...arrOriginal]

    const inputBox = letterBox[ROW]
    const current = inputBox.querySelectorAll("input")
    let rowanswer = ""
    current.forEach(input => {
        rowanswer += input.value
    })
    if (rowanswer.length != MAX_COL)
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
        newgameBtn.hidden = false
        updateWinLoss(ROW)
        return
    }
    else if(!words.includes(rowanswer))
    {
        answerBox.textContent = `That is not a Word`
        return
    }
    else
    {
        changeColor(correctword, rowanswer, arr, current)
        if(ROW == MAX_ROW-1)
        {
            answerBox.textContent = `Incorrect, the answer is ${correctword}`
            newgameBtn.hidden = false
            updateWinLoss(ROW)
        }
        else
        {
            answerBox.textContent = `Incorrect`
            ROW++
            updateRow(ROW)
        }
    }
}

newgameBtn.addEventListener("click", startGame)

function changeColor(correctword, rowanswer, arr, current)
{
    for (let i = 0; i < MAX_COL; i++)
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
        // console.log(`${rowanswer[i]} - ${arr[rowanswer.charCodeAt(i)]}`)
        current[i].style.color = "white";
    }
}