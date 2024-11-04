document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token'); // Recuperar el token del localStorage
    if (!token) {
        alert("Debe iniciar sesión para acceder al dashboard.");
        window.location.href = 'login.html'; // Redirigir a la página de login si no hay token
        return;
    }

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    if (window.location.pathname.endsWith('financial-summary.html')) {
        await fetchFinancialSummary(headers);
    } else if (window.location.pathname.endsWith('client-statistics.html')) {
        await fetchClientStatistics(headers);
    } else if (window.location.pathname.endsWith('activity-data.html')) {
        await fetchActivityData(headers);
    } else if (window.location.pathname.endsWith('alerts.html')) {
        await fetchAlerts(headers);
    }
});

// Función para obtener el resumen financiero
async function fetchFinancialSummary(headers) {
    try {
        const response = await fetch('https://api-gymya-api.onrender.com/api/estadisticasfinancieras', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        document.getElementById('monthlyIncome').textContent = data.monthlyIncome;
        document.getElementById('pendingPayments').textContent = data.pendingPayments;

        const membershipsList = document.getElementById('activeMemberships');
        data.activeMemberships.forEach(membership => {
            const li = document.createElement('li');
            li.textContent = `Tipo: ${membership.type}, Cantidad: ${membership.count}`;
            membershipsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching financial summary:', error);
    }
}

// Función para obtener estadísticas de clientes
async function fetchClientStatistics(headers) {
    try {
        const response = await fetch('https://api-gymya-api.onrender.com/api/estadisticasclientes', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        document.getElementById('activeClients').textContent = data.activeClients;
        document.getElementById('newClientsThisMonth').textContent = data.newClientsThisMonth;

        const membershipTypeList = document.getElementById('clientsByMembershipType');
        data.clientsByMembershipType.forEach(type => {
            const li = document.createElement('li');
            li.textContent = `${type.membershipType}: ${type.count} clientes`;
            membershipTypeList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching client statistics:', error);
    }
}

// Función para obtener datos de actividad
async function fetchActivityData(headers) {
    try {
        const response = await fetch('https://api-gymya-api.onrender.com/api/estadisticasasistencias', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();
        document.getElementById('dailyAttendances').textContent = data.dailyAttendances;

        const recentAccessList = document.getElementById('recentAccessHistory');
        data.recentAccess.forEach(access => {
            const li = document.createElement('li');
            li.textContent = `Usuario: ${access.username}, Fecha y Hora: ${new Date(access.timestamp).toLocaleString()}`;
            recentAccessList.appendChild(li);
        });

        const topAttendeesList = document.getElementById('topAttendees');
        data.topAttendees.forEach(attendee => {
            const li = document.createElement('li');
            li.textContent = `Usuario: ${attendee.username}, Asistencias: ${attendee.attendanceCount}`;
            topAttendeesList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching activity data:', error);
    }
}

// Función para obtener alertas
async function fetchAlerts(headers) {
    try {
        const response = await fetch('https://api-gymya-api.onrender.com/api/estadisticasalertas', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Error en la respuesta del servidor');
        }

        const data = await response.json();

        const paymentAlertsList = document.getElementById('paymentAlerts');
        data.paymentAlerts.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = `Usuario: ${alert.username}, Alerta: ${alert.message}`;
            paymentAlertsList.appendChild(li);
        });

        const membershipExpiryAlertsList = document.getElementById('membershipExpiryAlerts');
        data.membershipExpiryAlerts.forEach(alert => {
            const li = document.createElement('li');
            li.textContent = `Usuario: ${alert.username}, Alerta: ${alert.message}`;
            membershipExpiryAlertsList.appendChild(li);
        });
    } catch (error) {
        console.error('Error fetching alerts:', error);
    }
}
