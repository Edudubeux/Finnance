const init = () => {
    if (!localStorage.getItem('data')) {
        fetch('data.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                localStorage.setItem('data', JSON.stringify(data));
                renderTable(data);
                filter()
            });
        return;
    }

    renderTable(JSON.parse(localStorage.data));
    filter();
};

const convertPrice = value => value.toLocaleString('pt-br', {
    style: 'currency', 
    currency: 'BRL'
});

const renderTable = data => {
    const tbody = document.getElementById('tbody');
    let tr = '';
    const type = {
        IN: 'Entrada',
        OUT: 'Saída'
    };

    data.forEach(value => {
        const parsedType = type[value.type];

        tr += `
            <tr>
                <th scope="row">${new Date(value.date).toLocaleDateString('pt-BR')}</th>
                <td>${value.customer.first_name} ${value.customer.last_name}</td>
                <td>${value.customer.phone}</td>
                <td>${value.store.name}</td>
                <td>${value.store.phone}</td>
                <td>${parsedType}</td>
                <td>${value.amount}</td>
                <td>${convertPrice(value.price)}</td>
                <td>${convertPrice(value.amount * value.price)}</td>
            </tr>
        `;
    });

    tbody.innerHTML = tr;
};

const balance = obj => {
    const result = document.getElementById('total');
    const ins = document.getElementById('ins');
    const outs = document.getElementById('outs');
    const prices = {
        IN: 0,
        OUT: 0
    };

    obj.forEach(value => {
        prices[value.type] += value.amount * value.price;
    });

    const total = prices.IN - prices.OUT;

    ins.innerHTML = `Total de entradas: ${convertPrice(prices.IN)}`;
    outs.innerHTML = `Total de saídas: ${convertPrice(prices.OUT)}`;
    result.innerHTML = `Saldo: ${convertPrice(total)}`;
}

const filter = () => {
    const obj = localStorage.getItem('data');
    const data = JSON.parse(obj);

    const select = document.getElementById('select');
    const dataFiltered = data.filter(value => select.value === value.type );

    if (!dataFiltered.length) {
        renderTable(data);
        balance(data)
        return;
    }
    
    balance(dataFiltered);
    renderTable(dataFiltered);
};

init();
