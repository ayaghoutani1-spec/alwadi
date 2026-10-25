// 1. دالة أمان عالمية لمنع انهيار السكربت بسبب الأزرار التي تحتوي على onclick="changeQuantity(...)"
window.changeQuantity = function (category, id, action) {
    console.log("تمت معالجة الحدث بنجاح لمنع الانهيار:", id, action);
};

document.addEventListener('DOMContentLoaded', () => {

    // 2. تفعيل أزرار الزيادة والنقصان وحفظ الكميات في الذاكرة بالاسم العربي
    document.querySelectorAll('.product-card, .ma-an-nuts-card, .toren-biscuits-card, .qousai-food-card').forEach(card => {
        const btnPlus = card.querySelector('.btn-plus');
        const btnMinus = card.querySelector('.btn-minus');
        const quantityNum = card.querySelector('.quantity-num');
        const heading = card.querySelector('h3, .product-name');

        if (btnPlus && btnMinus && quantityNum && heading) {
            const productName = heading.textContent.trim();
            const quantityId = quantityNum.getAttribute('id');

            if (quantityId) {
                let count = parseInt(localStorage.getItem(quantityId)) || 0;
                quantityNum.textContent = count;

                // إزالة أي أحداث قديمة وإضافة الأحداث الجديدة بشكل آمن
                btnPlus.addEventListener('click', (e) => {
                    e.preventDefault();
                    count++;
                    quantityNum.textContent = count;
                    localStorage.setItem(quantityId, count);
                    localStorage.setItem(quantityId + '_name', productName);
                    updateLiveInvoice();
                });

                btnMinus.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (count > 0) {
                        count--;
                        quantityNum.textContent = count;
                        if (count === 0) {
                            localStorage.removeItem(quantityId);
                            localStorage.removeItem(quantityId + '_name');
                        } else {
                            localStorage.setItem(quantityId, count);
                        }
                        updateLiveInvoice();
                    }
                });
            }
        }
    });

    // 3. البحث اللحظي الشامل والذكي (مقاوم لتكرار العناصر)
    // نبحث عن المربع سواء كان ID أو Class أو Input داخل search-container
    const searchInputs = document.querySelectorAll('#searchInput, .search-container input');

    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.trim().toLowerCase();

            // جلب الكروت الموجودة في الصفحة الحالية
            const productCards = document.querySelectorAll('.product-card, .ma-an-nuts-card, .toren-biscuits-card, .qousai-food-card');

            productCards.forEach(card => {
                const heading = card.querySelector('h3, .product-name');
                if (heading) {
                    const productName = heading.textContent.toLowerCase();
                    if (productName.includes(searchTerm)) {
                        card.style.setProperty('display', '', 'important');
                        card.style.display = ''; // إظهار الكارت
                    } else {
                        card.style.setProperty('display', 'none', 'important');
                        card.style.display = 'none'; // إخفاء الكارت
                    }
                }
            });
        });
    });


    // 4. دالة تشغيل الفاتورة الحية وتصفية المعرفات لعرض الاسم العربي
    function updateLiveInvoice() {
        const tableBody = document.getElementById("cart-table-body");
        const totalElement = document.getElementById("cart-total-qty");

        if (!tableBody) return;

        let totalQty = 0;
        tableBody.innerHTML = "";

        for (let i = 0; i < localStorage.length; i++) {
            let key = localStorage.key(i);

            if (key && key.startsWith('qty-') && !key.endsWith('_name')) {
                let qty = parseInt(localStorage.getItem(key)) || 0;
                let arabicName = localStorage.getItem(key + '_name') || "صنف غير معرف";

                if (qty > 0) {
                    totalQty += qty;
                    let row = `
                        <tr>
                            <td>${arabicName}</td>
                            <td style="text-align: center;">${qty}</td>
                            <td style="text-align: left;">طرد</td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                }
            }
        }

        if (totalQty === 0) {
            tableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:#888; padding: 20px 0;">السلة فارغة، يرجى العودة واختيار أصناف.</td></tr>`;
        }

        if (totalElement) {
            totalElement.innerText = totalQty + " طرود";
        }
    }

    updateLiveInvoice();
});
