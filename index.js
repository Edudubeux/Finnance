const init = () => {
    if (!localStorage.data) {
        axios('data.json')
            .then(response => {
                const data = response.data
                localStorage.setItem('data', JSON.stringify(data));
            });
    };

    return;
}

const data = JSON.parse(localStorage.getItem('data'));

function renderTable(data) {
    const tbody = document.getElementById('tbody')
    let tr = '';
    let type = '';

    data.forEach(value => {
        if(value.type === 'OUT'){
            type = "Saída";
        };
        
        if(value.type === 'IN'){
            type = "Entrada";
        };

        tr += `
        <tr>
            <th scope="row">${new Date(value.date).toLocaleDateString('pt-BR') }</th>
            <td>${value.customer.first_name} ${value.customer.last_name}</td>
            <td>${value.customer.phone}</td>
            <td>${value.store.name}</td>
            <td>${value.store.phone}</td>
            <td>${type}</td>
            <td>${value.amount}</td>
            <td>R$ ${value.price.toFixed(2)}</td>
            <td>R$ ${(value.amount*value.price).toFixed(2)}</td>
        </tr>
        `
    });

    tbody.innerHTML = tr;
};

init();
renderTable(data)