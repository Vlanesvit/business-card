// Функция для обновления классов на основе сравнения атрибутов
function updateSectionClasses(activeScreen) {
	document.querySelectorAll('.section').forEach(section => {
		const screenBlock = section.dataset.screenBlock;
		section.classList.remove('show');
		if (screenBlock === activeScreen) {
			section.classList.add('show');
		}
	});
}

document.addEventListener('click', (event) => {
	if (event.target.matches('[data-screen-btn]')) {
		event.preventDefault();
		// Получаем значение data-screen-btn у нажатой кнопки
		const activeScreen = event.target.dataset.screenBtn;
		// Обновляем классы секций
		updateSectionClasses(activeScreen);
	}
});

//========================================================================================================================================================
document.addEventListener('DOMContentLoaded', function () {
	// Запуск анимаций по конфигурации
	animationConfig.forEach(config => {
		revealOnScroll({
			elements: config.elements,
			duration: config.duration || 0.5,
			delay: config.delay || 0.2,
			direction: config.direction || 'bottom-up',
		});
	});
});

const animationConfig = [
	{ elements: '.titles', delay: 0.2 },
	{ elements: '.link-row', delay: 0.4 },
	{ elements: '.link-grid', delay: 0.6 },
	{ elements: '.link-main', delay: 0.8 },
	{ elements: '.section__footer', delay: 1 },
];

// Функция для плавного появления элементов на странице
function revealOnScroll({ elements, duration, delay, direction }) {
	const items = document.querySelectorAll(elements);

	// Определяем свойства для каждой анимации
	const animationPropsMap = {
		'bottom-up': { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
		'up-bottom': { from: { opacity: 0, transform: 'translateY(-20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
		'left-right': { from: { opacity: 0, transform: 'translateX(-20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
		'right-left': { from: { opacity: 0, transform: 'translateX(20px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
		'fade': { from: { opacity: 0 }, to: { opacity: 1 } },
		'scale': { from: { transform: 'scale(0)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
	};

	// Настройки Intersection Observer
	const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };

	items.forEach(item => {
		// Сохраняем начальные стили элемента
		item.setAttribute('data-original-style', item.getAttribute('style') || '');
		// Применяем начальные стили для анимации
		const { from } = animationPropsMap[direction.replace('--every', '')] || { from: {} };
		Object.assign(item.style, from);
		// Добавляем плавность изменения стилей
		item.style.transition = `all ${duration}s ease`;
		// Устанавливаем атрибут, чтобы отслеживать, выполнена ли анимация
		item.setAttribute('data-animation', 'false');
	});

	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry, index) => {
			if (entry.isIntersecting && entry.target.getAttribute('data-animation') === 'false') {
				// Отмечаем, что анимация для этого элемента началась
				entry.target.setAttribute('data-animation', 'true');

				const animationProps = animationPropsMap[direction.replace('--every', '')];
				if (animationProps) {
					// Рассчитываем окончательную задержку для текущего элемента
					const animationDelay = delay + (direction.includes('--every') ? delay * index : 0);

					setTimeout(() => {
						// Применяем конечные стили
						Object.assign(entry.target.style, animationProps.to);

						// Восстанавливаем начальные стили после завершения анимации
						setTimeout(() => {
							entry.target.setAttribute('style', entry.target.getAttribute('data-original-style'));
						}, duration * 1000);
					}, animationDelay * 1000);
				}

				// Перестаём наблюдать за элементом после начала анимации
				observer.unobserve(entry.target);
			}
		});
	}, observerOptions);

	// Начинаем отслеживать каждый элемент
	items.forEach(item => observer.observe(item));
}
