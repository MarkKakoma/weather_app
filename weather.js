// Location information (cities to be used in the program)




// Hourly focast information

// toggle buttons in top section. This code uses the DOM to handle the logic for 
// altering the color of the toggle button once the label is clicked. 
document.addEventListener('DOMContentLoaded', () => {

const switches = document.querySelectorAll('.switch');

switches.forEach(label => {
    const checkbox = label.querySelector('.switch_input');

    checkbox.addEventListener('change', () => {
        if(checkbox.checked){
            label.style.backgroundColor = 'aquamarine';
        }
        else{
            label.style.backgroundColor = 'rgb(70, 39, 15)'
            }
        });
    });
});

