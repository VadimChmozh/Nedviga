document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // ⚙️ НАСТРОЙКИ УВЕДОМЛЕНИЙ (TELEGRAM + EMAIL)
    // ==========================================================================
    const TELEGRAM_BOT_TOKEN = '8993404394:AAFlQj9A6x8UciEJYHAEMyspC-jh6DYbt9Y';
    const TELEGRAM_CHAT_ID = '2069230132';
    const BACKUP_EMAIL = 'vadimcmoz@gmail.com';

    // ==========================================================================
    // 🏢 БАЗА ДАННЫХ НЕДВИЖИМОСТИ ПО УМОЛЧАНИЮ
    // ==========================================================================
    const defaultProperties = [
        {
            id: 'prop-1',
            title: "Премиальная резиденция с бассейном",
            type: "Дом",
            price: 18500000,
            location: "г. Армавир, ул. Розы Люксембург, 14",
            area: 240,
            rooms: 5,
            img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
            desc: "Авторский проект загородной резиденции с ландшафтным дизайном, подогреваемым бассейном и зоной BBQ. Итальянская мебель, техника Miele. Готов к заселению."
        },
        {
            id: 'prop-2',
            title: "Элитный пентхаус с панорамной террасой",
            type: "Квартира",
            price: 9400000,
            location: "г. Армавир, ул. Кирова, 48 (ЖК «Центральный»)",
            area: 96,
            rooms: 3,
            img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
            desc: "Видовой пентхаус на верхнем этаже нового клубного дома. Витражное остекление, индивидуальное отопление, дизайнерская отделка. Паркинг включен."
        },
        {
            id: 'prop-3',
            title: "Современный хай-тек коттедж в Заветном",
            type: "Дом",
            price: 12800000,
            location: "г. Армавир, пос. Заветный, ул. Тенистая",
            area: 165,
            rooms: 4,
            img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
            desc: "Коттедж с плоской эксплуатируемой кровлей, мастер-спальней и гардеробной. Система «Умный дом», теплые полы, гараж на 2 авто."
        },
        {
            id: 'prop-4',
            title: "Дизайнерская 2-комнатная квартира",
            type: "Квартира",
            price: 6100000,
            location: "г. Армавир, ул. Ефремова, 102",
            area: 64,
            rooms: 2,
            img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
            desc: "Стильная квартира со свежим ремонтом. Шумоизоляция, встроенная кухня с каменной столешницей, закрытая охраняемая территория."
        },
        {
            id: 'prop-5',
            title: "Уютный семейный таунхаус",
            type: "Таунхаус",
            price: 8900000,
            location: "г. Армавир, ул. Советской Армии",
            area: 130,
            rooms: 4,
            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            desc: "Двухуровневый таунхаус с приватным двориком. Центральные коммуникации, низкие коммунальные платежи, тихий зеленый район."
        }
    ];

    let properties = [];

    // ==========================================================================
    // 1. ИНИЦИАЛИЗАЦИЯ И РЕНДЕР КАТАЛОГА
    // ==========================================================================
    function initDatabase() {
        const localData = localStorage.getItem('prestige_realty_db');
        if (localData) {
            try {
                properties = JSON.parse(localData);
            } catch (e) {
                properties = [...defaultProperties];
            }
        } else {
            properties = [...defaultProperties];
            saveToStorage();
        }

        renderCatalog(properties);
        updateSelectOptions();
        updateAdminCount();
    }

    function saveToStorage() {
        localStorage.setItem('prestige_realty_db', JSON.stringify(properties));
        updateAdminCount();
    }

    function renderCatalog(items) {
        const grid = document.getElementById('propertiesCatalog');
        const emptyNotice = document.getElementById('catalogEmpty');
        const statCount = document.getElementById('statCount');

        if (statCount) statCount.textContent = `${properties.length}+`;

        if (!grid) return;
        grid.innerHTML = '';

        if (items.length === 0) {
            if (emptyNotice) emptyNotice.style.display = 'block';
            return;
        } else {
            if (emptyNotice) emptyNotice.style.display = 'none';
        }

        items.forEach(prop => {
            const card = document.createElement('div');
            card.className = 'property-card';
            card.innerHTML = `
                <div class="card-media">
                    <img src="${prop.img}" alt="${prop.title}" loading="lazy">
                    <span class="card-tag">${prop.type}</span>
                </div>
                <div class="card-body">
                    <div>
                        <div class="card-price">${Number(prop.price).toLocaleString()} ₽</div>
                        <h3 class="card-title">${prop.title}</h3>
                        <div class="card-location">📍 ${prop.location}</div>
                        <div class="card-features">
                            <span>📐 ${prop.area} м²</span>
                            <span>🚪 ${prop.rooms}-комн.</span>
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-outline btn-sm" onclick="showPropertyDetails('${prop.id}')">Подробнее</button>
                        <a href="#booking" class="btn btn-gold btn-sm" onclick="selectPropertyForLead('${prop.title}')">Записаться</a>
                    </div>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function updateSelectOptions() {
        const select = document.getElementById('propertySelect');
        if (!select) return;

        select.innerHTML = '<option value="Консультация по подбору">Общая консультация / Подбор жилья</option>';
        properties.forEach(item => {
            const opt = document.createElement('option');
            opt.value = item.title;
            opt.textContent = `Объект: ${item.title} (${Number(item.price).toLocaleString()} ₽)`;
            select.appendChild(opt);
        });
    }

    window.selectPropertyForLead = (title) => {
        const select = document.getElementById('propertySelect');
        if (select) select.value = title;
    };

    // ==========================================================================
    // 2. ДЕТАЛЬНОЕ ОКНО ОБЪЕКТА
    // ==========================================================================
    window.showPropertyDetails = (id) => {
        const prop = properties.find(p => p.id === id);
        if (!prop) return;

        const content = document.getElementById('propDetailsContent');
        content.innerHTML = `
            <div class="details-grid">
                <div class="details-gallery">
                    <img src="${prop.img}" alt="${prop.title}">
                </div>
                <div class="details-content">
                    <span class="badge-gold">${prop.type}</span>
                    <h3>${prop.title}</h3>
                    <div class="details-price">${Number(prop.price).toLocaleString()} ₽</div>
                    <div class="card-location" style="margin-bottom: 20px;">📍 ${prop.location}</div>
                    
                    <div class="details-spec-list">
                        <div><strong>Площадь:</strong> ${prop.area} м²</div>
                        <div><strong>Комнат:</strong> ${prop.rooms}</div>
                        <div><strong>Юр. статус:</strong> Чистая продажа</div>
                        <div><strong>Ипотека:</strong> Подходит (от 6%)</div>
                    </div>

                    <p style="color: var(--text-muted); margin-bottom: 25px; line-height: 1.6;">${prop.desc}</p>
                    
                    <a href="#booking" class="btn btn-gold btn-block" onclick="closeDetailsModal(); selectPropertyForLead('${prop.title}');">Забронировать просмотр этого объекта</a>
                </div>
            </div>
        `;

        document.getElementById('propDetailsModal').classList.add('active');
    };

    window.closeDetailsModal = () => {
        document.getElementById('propDetailsModal').classList.remove('active');
    };

    // ==========================================================================
    // 3. ФИЛЬТРАЦИЯ И ПОИСК
    // ==========================================================================
    window.applyFilters = () => {
        const query = document.getElementById('searchQuery').value.toLowerCase().trim();
        const type = document.getElementById('filterType').value;
        const rooms = document.getElementById('filterRooms').value;
        const sort = document.getElementById('filterSort').value;

        let result = [...properties];

        if (query) {
            result = result.filter(p => 
                p.title.toLowerCase().includes(query) || 
                p.location.toLowerCase().includes(query) ||
                p.desc.toLowerCase().includes(query)
            );
        }

        if (type !== 'all') {
            result = result.filter(p => p.type === type);
        }

        if (rooms !== 'all') {
            if (rooms === '4+') {
                result = result.filter(p => Number(p.rooms) >= 4);
            } else {
                result = result.filter(p => Number(p.rooms) === Number(rooms));
            }
        }

        if (sort === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sort === 'area-desc') {
            result.sort((a, b) => b.area - a.area);
        }

        renderCatalog(result);
        showToast(`Найдено объектов: ${result.length}`);
    };

    window.resetFilters = () => {
        document.getElementById('searchQuery').value = '';
        document.getElementById('filterType').value = 'all';
        document.getElementById('filterRooms').value = 'all';
        document.getElementById('filterSort').value = 'default';
        renderCatalog(properties);
    };

    // ==========================================================================
    // 4. ИПОТЕЧНЫЙ КАЛЬКУЛЯТОР
    // ==========================================================================
    const calcPrice = document.getElementById('calcPrice');
    const calcInitial = document.getElementById('calcInitial');
    const calcYears = document.getElementById('calcYears');
    const calcRate = document.getElementById('calcRate');

    function calculateMortgage() {
        if (!calcPrice || !calcInitial || !calcYears || !calcRate) return;

        const price = Number(calcPrice.value);
        const initialPercent = Number(calcInitial.value);
        const years = Number(calcYears.value);
        const rateYear = Number(calcRate.value);

        const initialSum = Math.round(price * (initialPercent / 100));
        const loan = price - initialSum;

        document.getElementById('calcPriceDisplay').textContent = `${price.toLocaleString()} ₽`;
        document.getElementById('calcInitialDisplay').textContent = `${initialSum.toLocaleString()} ₽ (${initialPercent}%)`;
        document.getElementById('calcYearsDisplay').textContent = `${years} лет`;
        document.getElementById('calcRateDisplay').textContent = `${rateYear}%`;

        const monthlyRate = (rateYear / 12) / 100;
        const totalMonths = years * 12;

        let payment = 0;
        if (loan > 0) {
            payment = loan * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }

        document.getElementById('monthlyPayment').textContent = `${Math.round(payment).toLocaleString()} ₽`;
        document.getElementById('loanAmount').textContent = `${loan.toLocaleString()} ₽`;
        document.getElementById('requiredIncome').textContent = `~${Math.round(payment * 1.6).toLocaleString()} ₽`;
    }

    [calcPrice, calcInitial, calcYears, calcRate].forEach(input => {
        if (input) input.addEventListener('input', calculateMortgage);
    });

    calculateMortgage();

    window.prefillMortgage = () => {
        const select = document.getElementById('propertySelect');
        const comment = document.getElementById('clientComment');
        if (select) select.value = 'Консультация по подбору';
        if (comment) {
            const sum = document.getElementById('monthlyPayment').textContent;
            comment.value = `Интересует расчет ипотеки. Ориентировочный платеж: ${sum}. Нужна помощь в одобрении.`;
        }
    };

    // ==========================================================================
    // 5. МАСКА ТЕЛЕФОНА (+7)
    // ==========================================================================
    const phoneInput = document.getElementById('clientPhone');

    if (phoneInput) {
        const getInputNumbersValue = (input) => input.value.replace(/\D/g, '');

        phoneInput.addEventListener('input', (e) => {
            let input = e.target;
            let inputNumbersValue = getInputNumbersValue(input);
            let formattedInputValue = '';

            if (!inputNumbersValue) {
                input.value = '';
                return;
            }

            if (['7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
                if (inputNumbersValue[0] === '9') inputNumbersValue = '7' + inputNumbersValue;
                formattedInputValue = '+7 ';

                if (inputNumbersValue.length > 1) {
                    formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
                }
                if (inputNumbersValue.length >= 5) {
                    formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
                }
                if (inputNumbersValue.length >= 8) {
                    formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
                }
                if (inputNumbersValue.length >= 10) {
                    formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
                }
            } else {
                formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
            }

            input.value = formattedInputValue;
        });

        phoneInput.addEventListener('focus', (e) => {
            if (!e.target.value) e.target.value = '+7 ';
        });

        phoneInput.addEventListener('blur', (e) => {
            if (e.target.value === '+7 ' || e.target.value === '+7') e.target.value = '';
        });
    }

    // ==========================================================================
    // 6. ОТПРАВКА ЗАЯВОК (TELEGRAM + EMAIL)
    // ==========================================================================
    const realtorForm = document.getElementById('realtorForm');

    if (realtorForm) {
        realtorForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('clientName').value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const propTarget = document.getElementById('propertySelect').value;
            const comment = document.getElementById('clientComment').value.trim();

            if (phone.replace(/\D/g, '').length < 11) {
                alert('Пожалуйста, введите номер телефона полностью: +7 (XXX) XXX-XX-XX');
                phoneInput.focus();
                return;
            }

            const submitBtn = document.getElementById('submitLeadBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;

            const message = `🏢 НОВАЯ ЗАЯВКА НА НЕДВИЖИМОСТЬ!\n\n` +
                            `👤 Клиент: ${name}\n` +
                            `📞 Телефон: ${phone}\n` +
                            `🏠 Объект: ${propTarget}\n` +
                            `💬 Пожелания: ${comment || 'Не указаны'}`;

            const sendTelegram = async () => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 2500);

                try {
                    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message }),
                        signal: controller.signal
                    });
                } catch (err) {
                    console.log('TG');
                } finally {
                    clearTimeout(timeoutId);
                }
            };

            const sendEmail = async () => {
                try {
                    await fetch(`https://formsubmit.co/ajax/${BACKUP_EMAIL}`, {
                        method: 'POST',
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            _subject: '🏢 Новая заявка на недвижимость',
                            Клиент: name,
                            Телефон: phone,
                            Объект: propTarget,
                            Пожелания: comment
                        })
                    });
                } catch (e) {
                    console.log('Email');
                }
            };

            await Promise.allSettled([sendTelegram(), sendEmail()]);

            alert(`Спасибо, ${name}! Ваша заявка успешно принята. Риелтор свяжется с вами по номеру ${phone} в течение 10 минут.`);
            realtorForm.reset();

            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
    }

    // ==========================================================================
    // 7. АДМИН-ПАНЕЛЬ (CMS)
    // ==========================================================================
    window.openAdminModal = () => {
        const pass = prompt('Введите пароль администратора:', 'admin');
        if (pass === 'admin') {
            document.getElementById('adminModal').classList.add('active');
            renderAdminItems();
        } else if (pass !== null) {
            alert('Неверный пароль доступа!');
        }
    };

    window.closeAdminModal = () => {
        document.getElementById('adminModal').classList.remove('active');
    };

    window.switchAdminTab = (tabId) => {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

        event.target.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    };

    function updateAdminCount() {
        const countBadge = document.getElementById('adminListCount');
        if (countBadge) countBadge.textContent = properties.length;
    }

    function renderAdminItems() {
        const container = document.getElementById('adminItemsList');
        if (!container) return;
        container.innerHTML = '';

        properties.forEach(item => {
            const row = document.createElement('div');
            row.className = 'admin-item-card';
            row.innerHTML = `
                <div class="admin-item-preview">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="admin-item-meta">
                        <strong>${item.title}</strong>
                        <span>${item.type} • ${Number(item.price).toLocaleString()} ₽ • ${item.location}</span>
                    </div>
                </div>
                <div class="admin-btns-group">
                    <button class="btn-ctrl edit" onclick="editPropertyItem('${item.id}')">Изменить</button>
                    <button class="btn-ctrl del" onclick="deletePropertyItem('${item.id}')">Удалить</button>
                </div>
            `;
            container.appendChild(row);
        });
    }

    window.handleSaveProperty = (e) => {
        e.preventDefault();

        const editId = document.getElementById('adminEditId').value;
        const title = document.getElementById('admTitle').value.trim();
        const type = document.getElementById('admType').value;
        const price = Number(document.getElementById('admPrice').value);
        const area = Number(document.getElementById('admArea').value);
        const rooms = Number(document.getElementById('admRooms').value);
        const location = document.getElementById('admLocation').value.trim();
        const img = document.getElementById('admImage').value.trim() || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
        const desc = document.getElementById('admDesc').value.trim();

        if (editId) {
            const idx = properties.findIndex(p => p.id === editId);
            if (idx !== -1) {
                properties[idx] = { id: editId, title, type, price, area, rooms, location, img, desc };
                showToast('Объявление обновлено!');
            }
        } else {
            const newObj = {
                id: 'prop-' + Date.now(),
                title, type, price, area, rooms, location, img, desc
            };
            properties.unshift(newObj);
            showToast('Новый объект опубликован!');
        }

        saveToStorage();
        renderCatalog(properties);
        updateSelectOptions();
        renderAdminItems();
        resetAdminForm();

        document.querySelectorAll('.admin-tab')[1].click();
    };

    window.editPropertyItem = (id) => {
        const item = properties.find(p => p.id === id);
        if (!item) return;

        document.getElementById('adminEditId').value = item.id;
        document.getElementById('admTitle').value = item.title;
        document.getElementById('admType').value = item.type;
        document.getElementById('admPrice').value = item.price;
        document.getElementById('admArea').value = item.area;
        document.getElementById('admRooms').value = item.rooms;
        document.getElementById('admLocation').value = item.location;
        document.getElementById('admImage').value = item.img;
        document.getElementById('admDesc').value = item.desc;

        document.getElementById('admSubmitBtn').textContent = 'Применить изменения ⚙️';
        document.querySelectorAll('.admin-tab')[0].click();
    };

    window.deletePropertyItem = (id) => {
        const item = properties.find(p => p.id === id);
        if (!item) return;

        if (confirm(`Удалить объект «${item.title}» из каталога?`)) {
            properties = properties.filter(p => p.id !== id);
            saveToStorage();
            renderCatalog(properties);
            updateSelectOptions();
            renderAdminItems();
            showToast('Объект удален из базы.');
        }
    };

    window.resetAdminForm = () => {
        document.getElementById('adminPropForm').reset();
        document.getElementById('adminEditId').value = '';
        document.getElementById('admSubmitBtn').textContent = 'Опубликовать 🌟';
    };

    window.exportDataToFile = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(properties, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "realty_database_backup.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('База данных скачана!');
    };

    window.importDataFromFile = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const parsed = JSON.parse(e.target.result);
                if (Array.isArray(parsed)) {
                    properties = parsed;
                    saveToStorage();
                    renderCatalog(properties);
                    updateSelectOptions();
                    renderAdminItems();
                    showToast('База импортирована!');
                } else {
                    alert('Неверный формат базы данных!');
                }
            } catch (err) {
                alert('Ошибка чтения файла!');
            }
        };
        reader.readAsText(file);
    };

    // ==========================================================================
    // 8. УПРАВЛЕНИЕ МОБИЛЬНЫМ МЕНЮ И ШТОРКОЙ
    // ==========================================================================
    function showToast(text) {
        const toast = document.getElementById('toastBox');
        const msg = document.getElementById('toastMessage');
        if (!toast || !msg) return;

        msg.textContent = text;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 3000);
    }

    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navBackdrop = document.getElementById('navBackdrop');
    const mobileNavClose = document.getElementById('mobileNavClose');

    window.closeMobileNav = () => {
        if (navMenu) navMenu.classList.remove('active');
        if (burgerBtn) burgerBtn.classList.remove('active');
        if (navBackdrop) navBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    };

    window.openMobileNav = () => {
        if (navMenu) navMenu.classList.add('active');
        if (burgerBtn) burgerBtn.classList.add('active');
        if (navBackdrop) navBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                window.closeMobileNav();
            } else {
                window.openMobileNav();
            }
        });
    }

    if (mobileNavClose) {
        mobileNavClose.addEventListener('click', window.closeMobileNav);
    }

    if (navBackdrop) {
        navBackdrop.addEventListener('click', window.closeMobileNav);
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', window.closeMobileNav);
    });

    // Запуск сайта
    initDatabase();
});
