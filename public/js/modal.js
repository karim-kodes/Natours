class Modal {
  constructor() {
    this.createModalElements();
  }

  createModalElements() {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "modal-overlay";
    this.overlay.innerHTML = `
      <div class="modal-container">
        <div class="modal-icon"></div>
        <h2 class="modal-title"></h2>
        <p class="modal-message"></p>
        <div class="modal-buttons"></div>
      </div>
    `;
    document.body.appendChild(this.overlay);

    // Add styles
    this.addStyles();
  }

  addStyles() {
    if (document.getElementById("modal-styles")) return;

    const style = document.createElement("style");
    style.id = "modal-styles";
    style.textContent = `
      .modal-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        align-items: center;
        justify-content: center;
      }

      .modal-overlay.active {
        display: flex;
      }

      .modal-container {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        animation: modalSlideIn 0.3s ease;
      }

      @keyframes modalSlideIn {
        from {
          transform: translateY(-50px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }

      .modal-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
      }

      .modal-icon.success {
        background: #d4edda;
        color: #28a745;
      }

      .modal-icon.error {
        background: #f8d7da;
        color: #dc3545;
      }

      .modal-icon.warning {
        background: #fff3cd;
        color: #ffc107;
      }

      .modal-icon.info {
        background: #d1ecf1;
        color: #17a2b8;
      }

      .modal-title {
        margin: 0 0 0.5rem;
        font-size: 1.5rem;
        color: #333;
      }

      .modal-message {
        margin: 0 0 1.5rem;
        color: #666;
        line-height: 1.5;
      }

      .modal-buttons {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
      }

      .modal-btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 500;
        transition: all 0.2s;
      }

      .modal-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .modal-btn.primary {
        background: #007bff;
        color: white;
      }

      .modal-btn.success {
        background: #28a745;
        color: white;
      }

      .modal-btn.danger {
        background: #dc3545;
        color: white;
      }

      .modal-btn.secondary {
        background: #6c757d;
        color: white;
      }
    `;
    document.head.appendChild(style);
  }

  show({ type = "info", title, message, buttons = [] }) {
    const container = this.overlay.querySelector(".modal-container");
    const icon = container.querySelector(".modal-icon");
    const titleEl = container.querySelector(".modal-title");
    const messageEl = container.querySelector(".modal-message");
    const buttonsEl = container.querySelector(".modal-buttons");

    // Set icon
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ⓘ",
    };
    icon.textContent = icons[type] || icons.info;
    icon.className = `modal-icon ${type}`;

    // Set content
    titleEl.textContent = title;
    messageEl.textContent = message;

    // Set buttons
    buttonsEl.innerHTML = "";
    buttons.forEach((btn) => {
      const button = document.createElement("button");
      button.className = `modal-btn ${btn.class || "primary"}`;
      button.textContent = btn.text;
      button.onclick = () => {
        this.hide();
        if (btn.onClick) btn.onClick();
      };
      buttonsEl.appendChild(button);
    });

    // Show modal
    this.overlay.classList.add("active");

    // Close on overlay click
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) this.hide();
    };
  }

  hide() {
    this.overlay.classList.remove("active");
  }
}

// Initialize global modal
const modal = new Modal();

// ========================================
// HELPER FUNCTIONS
// ========================================

function showSuccess(message, title = "Success!", onClose) {
  modal.show({
    type: "success",
    title,
    message,
    buttons: [{ text: "OK", class: "success", onClick: onClose }],
  });
}

function showError(message, title = "Error!", onClose) {
  modal.show({
    type: "error",
    title,
    message,
    buttons: [{ text: "OK", class: "danger", onClick: onClose }],
  });
}

function showConfirm(message, title = "Confirm", onConfirm, onCancel) {
  modal.show({
    type: "warning",
    title,
    message,
    buttons: [
      { text: "Cancel", class: "secondary", onClick: onCancel },
      { text: "Confirm", class: "danger", onClick: onConfirm },
    ],
  });
}

function showInfo(message, title = "Information", onClose) {
  modal.show({
    type: "info",
    title,
    message,
    buttons: [{ text: "OK", class: "primary", onClick: onClose }],
  });
}
