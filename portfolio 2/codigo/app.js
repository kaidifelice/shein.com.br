gsap.registerPlugin(ScrollTrigger);

gsap.from(".hero-title", {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: "power2.out"
});

gsap.from(".hero-subtitle", {
    duration: 1.2,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    delay: 0.3
});

gsap.from(".hero-buttons", {
    duration: 1.4,
    y: 50,
    opacity: 0,
    ease: "power2.out",
    delay: 0.6
});

gsap.from(".scroll-section h2", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1,
    opacity: 0,
    y: 50,
    ease: "power2.out"
});

gsap.from(".scroll-section p", {
    scrollTrigger: {
        trigger: ".scroll-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    ease: "power2.out",
    delay: 0.2
});

gsap.from(".solutions-title", {
    scrollTrigger: {
        trigger: ".solutions-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    ease: "power2.out"
});

gsap.from(".solution-card", {
    scrollTrigger: {
        trigger: ".solutions-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power2.out"
});

gsap.from(".about-title, .about-text", {
    scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power2.out"
});

gsap.from(".skills-list li", {
    scrollTrigger: {
        trigger: ".skills-list",
        start: "top 90%",
        toggleActions: "play none none none"
    },
    duration: 0.8,
    opacity: 0,
    y: 20,
    stagger: 0.2,
    ease: "power2.out"
});

gsap.from(".projects-title", {
    scrollTrigger: {
        trigger: ".projects-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1.2,
    opacity: 0,
    y: 50,
    ease: "power2.out"
});

gsap.from(".project-card", {
    scrollTrigger: {
        trigger: ".projects-section",
        start: "top 80%",
        toggleActions: "play none none none"
    },
    duration: 1,
    opacity: 0,
    y: 50,
    stagger: 0.3,
    ease: "power2.out"
});

gsap.to("body", {
    backgroundColor: "#3371ff",
    color: "#fff",
    scrollTrigger: {
        trigger: ".color-transition-section",
        start: "top center",
        end: "bottom top",
        scrub: 1,
        onEnter: () => {
          gsap.to("body", {backgroundColor: "#3371ff"});
        },
        onLeaveBack: () => {
          gsap.to("body", {backgroundColor: "#0a0a0a"});
        }
    }
});