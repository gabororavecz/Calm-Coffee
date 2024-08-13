if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('service worker registered'))
    .catch(err => console.log('service worker not registered', err));
}

//dark scemhe
const toggleSwitch = document.querySelector('#themeSwitch');
if(toggleSwitch){
  toggleSwitch.addEventListener('change', switchTheme, false);
}



function switchTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
  }
}

//login.html cunstructor

const detail = document.querySelector('.detail');
const detailTitle = document.querySelector('.detail-title');
const masterItems = document.querySelectorAll('.master-item');

if (masterItems) {
  masterItems.forEach(item => {
    item.addEventListener('click', function() {
    console.log('Clicked item');
    // for(let item of masterItems){
    //   item.classList.remove('active-item');  //this removes the highlight from from the master item that has the active-item selected
    // }
    clearSelected();
  
    this.classList.add('active-item');
  
      detail.classList.remove('hidden-md-down');
  
    detailTitle.innerHTML = this.innerHTML;
    });
  });
}


function back(){
  console.log("back button pressed")
  detail.classList.add('hidden-md-down');
  clearSelected();
}

function clearSelected() {
  for(let item of masterItems){
      item.classList.remove('active-item');  //this removes the highlight from from the master item that has the active-item selected
     }
}

// function select(selected){
//     //Remove active class from all master-items
//     for(var item of masterItems){
//         item.classList.remove('active-item');
//     }
//     //Make selected tab active
//     selected.classList.add('active-item');
//     //Toggle the class that hides when the screen is medium size or less
//     detail.classList.remove('hidden-md-down');
//     //Set the content of the detail to the innerHTML of the selected item
//     detailTitle.innerHTML = selected.innerHTML;
// }

// function back(){
//     //Remove active class from all master-items
//     for(var item of masterItems){
//         item.classList.remove('active-item');
//     }
//     detail.classList.add('hidden-md-down');
//}

//multiple option registration starts

// document.addEventListener('DOMContentLoaded', function() {
//   var elems = document.querySelectorAll('select');
//   var instances = M.FormSelect.init(elems, options);
// });

// // Or with jQuery

// $(document).ready(function(){
//   $('select').formSelect();
// });

////multiple option registration ends