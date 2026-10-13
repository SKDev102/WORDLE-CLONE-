const letterBox = document.querySelectorAll(".letterBox")
const answerBox = document.getElementById("AnswerBox")
const correctword = "PICO"
let ROW = 0

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

updateRow(ROW)

function checkAnswer()
{
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
        answerBox.textContent= "Correct";
        return
    }
    else
    {
        answerBox.textContent = "Incorrect"
    }
    ROW++
    updateRow(ROW)
}



letterBox.forEach(row => {
    const inputBox = [...row.querySelectorAll("input")]
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
})