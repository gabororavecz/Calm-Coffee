// // Memory cache is the default if no config is specified.
// initializeFirestore(app);

// // This is the default behavior if no persistence is specified.
// initializeFirestore(app, {localCache: memoryLocalCache()});

// // Defaults to single-tab persistence if no tab manager is specified.
// initializeFirestore(app, {localCache: persistentLocalCache(/*settings*/{})});

// // Same as `initializeFirestore(app, {localCache: persistentLocalCache(/*settings*/{})})`,
// // but more explicit about tab management.
// initializeFirestore(app, 
//   {localCache: 
//     persistentLocalCache(/*settings*/{tabManager: persistentSingleTabManager()})
// });

// // Use multi-tab IndexedDb persistence.
// initializeFirestore(app, 
//   {localCache: 
//     persistentLocalCache(/*settings*/{tabManager: persistentMultipleTabManager()})
//   });



// enable offline data
db.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
      console.log('persistance failed');
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
      console.log('persistance not available');
    }
  });

// import { collection, onSnapshot, where, query } from "firebase/firestore"; 

// const q = query(collection(db, "recepies").onSnapshot(snapshot => {
//     snapshot.docChanges().forEach((change) => {
//         if (change.type === "added") {
//           renderRecipe(change.doc.data(), change.doc.id);
//         }
//         if (change.type === 'removed'){
//           //remove the document data from the web page
//           removeRecipe(change.doc.id);
//         }
//     });
// }));

//real-time listener
db.collection('recipes').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if(change.type === 'added'){
      //add the document data to the web page
      renderRecipe(change.doc.data(), change.doc.id);
    }
    if(change.type === 'removed'){
      //remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  });
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt => {
  evt.preventDefault();
  
  const recipe = {
    name: form.title.value,
    ingredients: form.ingredients.value
  };

  db.collection('recipes').add(recipe)
    .catch(err => console.log(err));

  form.title.value = '';
  form.ingredients.value = '';
});

// remove a recipe
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt => {
  if(evt.target.tagName === 'I'){
    const id = evt.target.getAttribute('data-id');
    //console.log(id);
    db.collection('recipes').doc(id).delete();
  }
})