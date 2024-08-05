document.addEventListener('DOMContentLoaded', () => {
    // Hide all forms initially
    const forms = document.querySelectorAll('.form-container');
    forms.forEach(form => form.style.display = 'none');

    // Show the relevant form when a sidebar link is clicked
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute('data-target');
            forms.forEach(form => {
                form.style.display = form.id === targetId ? 'block' : 'none';
            });
        });
    });

    // IndexedDB setup
    let db;
    const request = window.indexedDB.open('errorCodesDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('errorCodes', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('brand', 'brand', { unique: false });
        objectStore.createIndex('errorCode', 'errorCode', { unique: true });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        displayAllErrorCodes();
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    // Form submission handlers
    const addForm = document.getElementById('errorForm');
    const editForm = document.getElementById('editForm');
    const deleteForm = document.getElementById('deleteForm');
    const searchForm = document.getElementById('searchForm');
    const displayDiv = document.getElementById('displayList');

    if (addForm) {
        addForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const brand = addForm.brand.value;
            const errorCode = addForm.error_code.value;
            const description = addForm.description.value;

            const transaction = db.transaction(['errorCodes'], 'readwrite');
            const objectStore = transaction.objectStore('errorCodes');
            const newRecord = { brand, errorCode, description };

            const request = objectStore.add(newRecord);

            request.onsuccess = () => {
                addForm.reset();
                displayMessage('Error code added successfully', 'success', 'errorDisplay');
                displayAllErrorCodes();
            };

            request.onerror = () => {
                displayMessage('Error adding error code', 'error', 'errorDisplay');
            };
        });
    }

    if (editForm) {
        editForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const code = editForm.editCode.value;
            const description = editForm.editDescription.value;

            const transaction = db.transaction(['errorCodes'], 'readwrite');
            const objectStore = transaction.objectStore('errorCodes');
            const index = objectStore.index('errorCode');
            const request = index.get(code);

            request.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    data.description = description;
                    const updateRequest = objectStore.put(data);
                    updateRequest.onsuccess = () => {
                        editForm.reset();
                        displayMessage('Error code updated successfully', 'success', 'editDisplay');
                        displayAllErrorCodes();
                    };
                    updateRequest.onerror = () => {
                        displayMessage('Error updating error code', 'error', 'editDisplay');
                    };
                } else {
                    displayMessage('Error code not found', 'error', 'editDisplay');
                }
            };

            request.onerror = () => {
                displayMessage('Error retrieving error code', 'error', 'editDisplay');
            };
        });
    }

    if (deleteForm) {
        deleteForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const code = deleteForm.deleteCode.value;

            const transaction = db.transaction(['errorCodes'], 'readwrite');
            const objectStore = transaction.objectStore('errorCodes');
            const index = objectStore.index('errorCode');
            const request = index.get(code);

            request.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    const deleteRequest = objectStore.delete(data.id);
                    deleteRequest.onsuccess = () => {
                        deleteForm.reset();
                        displayMessage('Error code deleted successfully', 'success', 'deleteDisplay');
                        displayAllErrorCodes();
                    };
                    deleteRequest.onerror = () => {
                        displayMessage('Error deleting error code', 'error', 'deleteDisplay');
                    };
                } else {
                    displayMessage('Error code not found', 'error', 'deleteDisplay');
                }
            };

            request.onerror = () => {
                displayMessage('Error retrieving error code', 'error', 'deleteDisplay');
            };
        });
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const code = searchForm.searchCode.value;

            const transaction = db.transaction(['errorCodes'], 'readonly');
            const objectStore = transaction.objectStore('errorCodes');
            const index = objectStore.index('errorCode');
            const request = index.get(code);

            request.onsuccess = (event) => {
                const data = event.target.result;
                if (data) {
                    displayMessage(`Brand: ${data.brand}<br>Error Code: ${data.errorCode}<br>Description: ${data.description}`, 'success', 'searchDisplay');
                } else {
                    displayMessage('Error code not found', 'error', 'searchDisplay');
                }
            };

            request.onerror = () => {
                displayMessage('Error retrieving error code', 'error', 'searchDisplay');
            };
        });
    }

    function displayAllErrorCodes() {
        const transaction = db.transaction(['errorCodes'], 'readonly');
        const objectStore = transaction.objectStore('errorCodes');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const data = event.target.result;
            displayDiv.innerHTML = '';
            if (data.length > 0) {
                data.forEach(record => {
                    displayDiv.innerHTML += `<p>Brand: ${record.brand}<br>Error Code: ${record.errorCode}<br>Description: ${record.description}</p>`;
                });
            } else {
                displayDiv.innerHTML = '<p>No error codes found</p>';
            }
        };

        request.onerror = () => {
            displayMessage('Error displaying error codes', 'error', 'displayList');
        };
    }

    function displayMessage(message, type, elementId) {
        const element = document.getElementById(elementId);
        element.innerHTML = `<p class="${type}">${message}</p>`;
    }
});