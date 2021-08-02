const deleteNote = (noteId) => {
    if(confirm("Are you sure you want to delete?")) {
        firebase.database().ref(`users/${googleUserId}/${noteId}`).remove();
    }
}

const editNote = (noteId) => {
    const editNoteModal = document.querySelector('#editNoteModal');
    const notesRef = firebase.database().ref(`users/${googleUserId}`);
    notesRef.on('value', (snapshot) => {
        const data = snapshot.val();
        const note = data[noteId];
        document.querySelector('#editTitleInput').value = note.title;
        document.querySelector('#editTextInput').value = note.text;
        document.querySelector('#editNoteId').value = noteId;
    });
    editNoteModal.classList.toggle('is-active');
}

const closeEditModal = () => {
    const editNoteModal = document.querySelector('#editNoteModal');
    editNoteModal.classList.toggle('is-active');
}

const saveEditedNote = () => {
    const noteTitle = document.querySelector('#editTitleInput').value;
    const noteText = document.querySelector('#editTextInput').value;
    const noteId = document.querySelector('#editNoteId').value;
    const noteEdits = {
        title: noteTitle,
        text: noteText
    }
    firebase.database().ref(`users/${googleUserId}/${noteId}`).update(noteEdits);
    closeEditModal();
}