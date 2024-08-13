//create references
const list = document.querySelector('ul');
const titleInput = document.querySelector('#title');
const bodyInput = document.querySelector('#body');
const form = document.querySelector('form');
const submitBtn = document.querySelector('form button');

//event handler for form submitted
form.addEventListener("submit", addData);

//reference to database - used by several functions
let db;

//open database - create it if it doesn't already exist  
const openRequest = window.indexedDB.open("notes_db", 1);

//error handler signifies that the database didn't open successfully
openRequest.addEventListener("error", () =>
    console.error("Database failed to open")
);

//success handler signifies that the database opened successfully
openRequest.addEventListener("success", () => {
    console.log("Database opened successfully");
    db = openRequest.result;
    displayData();
});

//set up the database tables if not already done
openRequest.addEventListener("upgradeneeded", (e) => {
    db = e.target.result;
    //create objectStore for notes with auto-incrementing key
    const objectStore = db.createObjectStore("notes_os", {
        keyPath: "id",
        autoIncrement: true,
    });

    //define data items in objectStore
    objectStore.createIndex("title", "title", { unique: false });
    objectStore.createIndex("body", "body", { unique: false });
    console.log("Database setup complete");
})

function addData(e) {
    //prevent default
    e.preventDefault();

    //get values from form and store in object to insert into the DB
    const newItem = { title: titleInput.value, body: bodyInput.value };

    //open a read/write transaction to add data
    const transaction = db.transaction(["notes_os"], "readwrite");

    //get reference to object store in database
    const objectStore = transaction.objectStore("notes_os");

    //make request to add newItem object to the object store
    const addRequest = objectStore.add(newItem);

addRequest.addEventListener("success", () => {
        //clear form, ready for next entry
        titleInput.value = "";
        bodyInput.value = "";
    });

    //report result of transaction completing
    transaction.addEventListener("complete", () => {
        console.log("Transaction completed: database modification finished.");
        displayData();
    });

    transaction.addEventListener("error", () =>
        console.log("Transaction not completed due to error")
    );
}
function displayData() {
    //empty list elements to prevent duplicate list when database updated
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    //open object store and get a cursor to iterate through items in the store
    const objectStore = db.transaction("notes_os").objectStore("notes_os");
    objectStore.openCursor().addEventListener("success", (e) => {
        const cursor = e.target.result;
        //if more data items, process next
        if (cursor) {
            //create a list item, h3, and p to contain data for display
            const listItem = document.createElement("li");
            const h3 = document.createElement("h3");
            const para = document.createElement("p");
            const deleteBtn = document.createElement("button");
            //add items to HTML
            listItem.appendChild(h3);
            listItem.appendChild(para);
            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);
            //store data from the cursor in the h3 and para
            h3.textContent = cursor.value.title;
            para.textContent = cursor.value.body;
            deleteBtn.textContent = "Delete";
           //store the ID as an attribute of listItem so it can be used for deleting
            listItem.setAttribute("data-note-id", cursor.value.id);
           //add event handler to deleteBtn
            deleteBtn.addEventListener("click", deleteItem);
           //move to next item in the cursor
            cursor.continue();
        } else {
            //if list item is empty, display 'No notes stored'
            if (!list.firstChild) {
                const listItem = document.createElement("li");
                listItem.textContent = "No notes stored.";
                list.appendChild(listItem);
            }
        }
    });
}


function deleteItem(e) {
    //get name of the task to delete and convert to a number
    const noteId = Number(e.target.parentNode.getAttribute("data-note-id"));

    //open a database transaction and delete the task using the id
    const transaction = db.transaction(["notes_os"], "readwrite");
    const objectStore = transaction.objectStore("notes_os");
    const deleteRequest = objectStore.delete(noteId);
//report that the data item has been deleted
    transaction.addEventListener("complete", () => {
        //delete the parent of the button
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log(`Note ${noteId} deleted.`);

        if (!list.firstChild) {
            const listItem = document.createElement("li");
            listItem.textContent = "No notes stored.";
            list.appendChild(listItem);
        }
    });
}

