document.querySelectorAll('.mfModal').forEach(item => {
    item.addEventListener('click', event => {
        const target = item.getAttribute('data-target');
        document.querySelector(target).classList.add('in');
        document.querySelector(target).style.display = 'block';
        document.querySelector('.modal-backdrop').classList.add('in');
        document.querySelector('.modal-backdrop').style.display = 'block';
    })
})

document.querySelectorAll('.modal').forEach(item => {
    item.addEventListener('click', event => {
        document.querySelectorAll('.modal').forEach(i => {
            i.classList.remove('in');
            i.style.display = 'none';
        })
        document.querySelector('.modal-backdrop').classList.remove('in');
        document.querySelector('.modal-backdrop').style.display = 'none';
    })
})

document.addEventListener('click', event => {
    console.log(event.target);
})