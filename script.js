document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  const scrollElements = document.querySelectorAll("[data-scroll], a[href^='#']");
  const nav = document.querySelector(".nav");

  scrollElements.forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetId = el.getAttribute("data-scroll") || el.getAttribute("href");
      if (!targetId || !targetId.startsWith("#")) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 72;

      window.scrollTo({
        top,
        behavior: "smooth",
      });

      if (nav && nav.classList.contains("open")) {
        nav.classList.remove("open");
      }
    });
  });

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;

    questionBtn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      faqItems.forEach((other) => other.classList.remove("open"));
      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });

  const burger = document.querySelector(".burger");
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  const form = document.getElementById("applyForm");
  const statusEl = document.getElementById("formStatus");

  if (form && statusEl) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      statusEl.textContent = "Отправляю заявку…";
      statusEl.className = "form-note";

      try {
        const formData = new FormData(form);
        const params = new URLSearchParams();
        formData.forEach((value, key) => {
          params.append(key, value);
        });

        console.log("Отправляем данные в Google Script:", form.action);
        const response = await fetch(form.action, {
          method: "POST",
          body: params.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
        });

        const text = await response.text();
        console.log("Ответ Google Script:", response.status, text);

        if (response.ok) {
          statusEl.textContent = "Ваша заявка отправлена. В самое ближайшее время мы с вами свяжемся.";
          statusEl.className = "form-success";
          form.reset();
        } else {
          statusEl.textContent = "❌ Ошибка на стороне Google Script. Подробности — в консоли.";
          statusEl.className = "form-error";
        }
      } catch (error) {
        console.error("Ошибка при отправке формы:", error);
        statusEl.textContent =
          "❌ Не удалось отправить заявку. Проверь соединение или Apps Script.";
        statusEl.className = "form-error";
      }
    });
  }

  const footerEl = document.querySelector(".footer");

  if ("IntersectionObserver" in window && footerEl) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footerEl.classList.add("footer--active");
          } else {
            footerEl.classList.remove("footer--active");
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(footerEl);
  }
});
