const init = () => {
    if (!localStorage.data) {
        fetch('data.json')
            .then(response => {
                return response.json();
            })
            .then(data => {
                localStorage.setItem('data', JSON.stringify(data));
                renderTable(data);
                return;
            });
    };
    return;
}

const data = JSON.parse(localStorage.data);

const renderTable = data => {
    const tbody = document.getElementById('tbody')
    let tr = '';
    let type = '';

    data.forEach(value => {
        if (value.type === 'OUT') {
            type = "Saída";
        };

        if (value.type === 'IN') {
            type = "Entrada";
        };

        tr += `
        <tr>
            <th scope="row">${new Date(value.date).toLocaleDateString('pt-BR')}</th>
            <td>${value.customer.first_name} ${value.customer.last_name}</td>
            <td>${value.customer.phone}</td>
            <td>${value.store.name}</td>
            <td>${value.store.phone}</td>
            <td>${type}</td>
            <td>${value.amount}</td>
            <td>R$ ${value.price.toFixed(2)}</td>
            <td>R$ ${(value.amount * value.price).toFixed(2)}</td>
        </tr>
        `
    });

    tbody.innerHTML = tr;
    return;
};

const balance = obj => {
    const result = document.getElementById('total');
    const ins = document.getElementById('ins');
    const outs = document.getElementById('outs');

    const outPrices = [];
    const inPrices = [];

    let totalOuts = 0;
    let totalIns = 0;

    obj.forEach(value => {
        if (value.type === 'OUT') {
            outPrices.push(value.amount * value.price);
            totalOuts = outPrices.reduce((acc, value) => {
                return acc + value;
            });
        }

        if (value.type === 'IN') {
            inPrices.push(value.amount * value.price);
            totalIns = inPrices.reduce((acc, value) => {
                return acc + value;
            });
        }
    });

    const total = totalIns - totalOuts;

    ins.innerHTML = `Total de entradas: R$ ${totalIns.toFixed(2)}`;
    outs.innerHTML = `Total de saídas R$ ${totalOuts.toFixed(2)}`;
    result.innerHTML = `Saldo R$ ${total.toFixed(2)}`;
}

const filter = () => {
    const select = document.getElementById('select');

    if (select.value === 'default') {
        renderTable(data);
        balance(data)
        return;
    };

    const dataFiltered = data.filter(value => {
        if (select.value === value.type) {
            return true;
        }
    });

    renderTable(dataFiltered);
    balance(dataFiltered);
    return;
};

renderTable(data);
filter()
init();
