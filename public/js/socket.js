const socket = io();

// Elements
const $cell = document.querySelectorAll('.cell');


$cell.forEach((cell) => {
    cell.addEventListener('click', (event) => {
        let index = findCoordinates(event);
        if (index.row === undefined && index.column === undefined) {
            $('#info').show();
            return setTimeout(() => {
                $('#info').hide();
            }, 2000);
        }
        socket.emit('cellClickEvent', index, (response, error) => {
            console.log('callback received from server !!', response);
        })
    });    
})


const findCoordinates = (event) => {
    return {
        row: event.target.parentNode.parentNode.rowIndex,
        column: event.target.parentNode.cellIndex,
        user: 'harisudhan'
    }
}