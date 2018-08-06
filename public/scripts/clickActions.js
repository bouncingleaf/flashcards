/**
 * The click actions scripts for the final project for CS602
 * @author Jessica Roy
 */

function add(){
    window.location.href = '/add';
}

function cancelAdd(newPage){
    window.location.href = newPage || '/all';
}
