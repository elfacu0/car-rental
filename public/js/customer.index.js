let modal = document.querySelector('.modal');
let modalMessage = modal.querySelector('.message-body');
let deleteButton = modal.querySelector('.modal-delete-button');
document.querySelectorAll('.modal-cancel-button').forEach((button) => {
    button.addEventListener('click', () => {
        modal.classList.remove('is-active');
    });
});
document.querySelectorAll('.action-delete').forEach(($deleteAction) => {
    const { id, name } = $deleteAction.dataset;
    $deleteAction.addEventListener('click', (e) => {
        modal.classList.add('is-active');
        modalMessage.textContent = `Are you sure you want to delete the customer ${name} with id ${id}`;
        deleteButton.href = `/customer/delete/${id}`;
        e.preventDefault();
    });
});
