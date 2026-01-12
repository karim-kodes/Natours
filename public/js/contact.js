const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const phoneNumber = document.querySelector(
      'input[name="phoneNumber"]'
    ).value;
    const subject = document.querySelector('input[name="subject"]').value;
    const message = document.querySelector('textarea[name="Message"]').value;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          subject,
          message,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        showSuccess(
          "Thank you! Your message has been sent. We'll get back to you soon.",
          "Message Sent!"
        );
        contactForm.reset();
      } else {
        throw new Error(data.message || "Something went wrong");
      }
    } catch (err) {
      showError(err.message || "Failed to send message. Please try again.");
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}
