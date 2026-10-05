/* ADMIN ACCESS: replace this placeholder with a unique secret of at least 24 characters. */
const ADMIN_KEY = "REPLACE_WITH_A_LONG_RANDOM_SECRET";
const adminKeyConfigured = ADMIN_KEY !== "REPLACE_WITH_A_LONG_RANDOM_SECRET" && ADMIN_KEY.length >= 24;
const isAdminMode = adminKeyConfigured && new URLSearchParams(window.location.search).get("admin") === ADMIN_KEY;

/* EDIT THIS SECTION: wedding details and relative static asset paths. */
const weddingData = {
    brideName: "NILESH",
    groomName: "SHUBHAM",
    weddingDate: "2026-12-12T12:31:00",
    muhurat: "12:31 PM · Shubh Muhurat",
    bridePhoto: "assets/images/bride.jpg",
    groomPhoto: "assets/images/groom.jpg",
    heroImage: "assets/images/couple.jpg",
    whatsappNumber: "91 7972784720",
    venueName: "The Gulmohar Palace",
    venueAddress: "Survey No. 18, Baner Road, Pune, Maharashtra 411045",
    googleMapsUrl: "https://maps.google.com/?q=Baner,Pune",
    weddingVideo: "",
    music: "assets/music/wedding-music.mp3",
    upiId: "",
    showGiftSection: false,
    gallery: [
        "assets/images/gallery1.jpg",
        "assets/images/gallery2.jpg",
        "assets/images/gallery3.jpg",
        "assets/images/gallery4.jpg",
        "assets/images/gallery5.jpg",
        "assets/images/gallery6.jpg",
        "assets/images/gallery7.jpg",
        "assets/images/gallery8.jpg",
        "assets/images/gallery9.jpg",
        "assets/images/gallery10.jpg",
        "assets/images/gallery11.jpg",
        "assets/images/gallery12.jpg"
    ],
    events: [
        { name: "Haldi", date: "23 February 2027", time: "10:00 AM", venue: "The Gulmohar Palace", description: "A morning of turmeric, blessings and sunshine.", mapsUrl: "" },
        { name: "Mehendi", date: "22 February 2027", time: "4:00 PM", venue: "The Gulmohar Palace", description: "Intricate henna, sweet treats and happy hearts.", mapsUrl: "" },
        { name: "Sangeet", date: "22 February 2027", time: "7:00 PM", venue: "The Gulmohar Palace", description: "An evening of music, dancing and family stories.", mapsUrl: "" },
        { name: "Wedding Ceremony", date: "24 February 2027", time: "12:31 PM", venue: "The Gulmohar Palace", description: "Join us as we begin our forever beneath the mandap.", mapsUrl: "" },
        { name: "Reception", date: "24 February 2027", time: "7:30 PM", venue: "The Gulmohar Palace", description: "Dinner, laughter and a toast to new beginnings.", mapsUrl: "" }
    ],
    story: [
        { title: "First Meeting", date: "A lovely surprise", description: "One ordinary day became the start of our favourite story." },
        { title: "First Conversation", date: "A little later", description: "A quick hello turned into hours of easy conversation." },
        { title: "The Proposal", date: "A heartfelt yes", description: "A question, a pause, and the easiest answer of our lives." },
        { title: "Engagement", date: "A promise made", description: "Our families came together to celebrate the next chapter." },
        { title: "Wedding Day", date: "24 February 2026", description: "The beginning of our forever, with all of you beside us." }
    ],
    brideFamily: { title: "Bride's Family", father: "Mr. & Mrs. Sharma", mother: "With love and gratitude", members: "and the Sharma family" },
    groomFamily: { title: "Groom's Family", father: "Mr. & Mrs. Mehta", mother: "With love and gratitude", members: "and the Mehta family" }
};

const STORAGE_KEY = "wedding-invitation-data-v1";
const defaultWeddingData = JSON.parse(JSON.stringify(weddingData));
let savedData = null;
try { savedData = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null"); } catch (error) { console.warn("Saved invitation data could not be read.", error); }
if (savedData && typeof savedData === "object") Object.assign(weddingData, savedData);
if (savedData && typeof savedData === "object") {
    weddingData.bridePhoto = staticAssetPath(weddingData.bridePhoto, "image", defaultWeddingData.bridePhoto);
    weddingData.groomPhoto = staticAssetPath(weddingData.groomPhoto, "image", defaultWeddingData.groomPhoto);
    weddingData.heroImage = staticAssetPath(weddingData.heroImage, "image", defaultWeddingData.heroImage);
    weddingData.gallery = Array.isArray(weddingData.gallery)
        ? weddingData.gallery.map((path, index) => staticAssetPath(path, "image", defaultWeddingData.gallery[index] || defaultWeddingData.heroImage))
        : [...defaultWeddingData.gallery];
    weddingData.music = staticAssetPath(weddingData.music, "audio", defaultWeddingData.music);
    weddingData.weddingVideo = staticAssetPath(weddingData.weddingVideo, "video", "");
}

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value = "") => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const safeUrl = (value, fallback = "#") => {
    const url = String(value || "").trim();
    if (/^(https?:\/\/|assets\/|data:image\/)/i.test(url)) return url;
    return fallback;
};
function staticAssetPath(value, type, fallback = "") {
    const path = String(value || "").trim();
    if (type === "image" && /^data:image\/(?:jpeg|png|webp|gif);base64,/i.test(path)) return path;
    const extensions = {
        image: /^assets\/images\/[A-Za-z0-9._-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i,
        audio: /^assets\/music\/[A-Za-z0-9._-]+\.mp3$/i,
        video: /^assets\/videos\/[A-Za-z0-9._-]+\.(?:mp4|m4v|webm|ogv)$/i
    };
    return extensions[type]?.test(path) ? path : fallback;
}
const dateObject = value => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
};
const formattedDate = (value, options = { weekday: "long", day: "numeric", month: "long", year: "numeric" }) => {
    const date = dateObject(value);
    return date ? new Intl.DateTimeFormat("en-IN", options).format(date) : "Date to be announced";
};
const localDateTime = value => {
    const date = dateObject(value);
    if (!date) return "";
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
};

function renderInvitation() {
    document.title = `Wedding Invitation | ${weddingData.brideName} & ${weddingData.groomName}`;
    $("meta[property='og:title']").content = document.title;
    $("meta[property='og:image']").content = staticAssetPath(weddingData.heroImage, "image", defaultWeddingData.heroImage);
    $("#heroImage").style.backgroundImage = `url("${staticAssetPath(weddingData.heroImage, "image", defaultWeddingData.heroImage)}")`;
    $("#heroNames").innerHTML = `<span>${escapeHTML(weddingData.brideName)}</span><span class="ampersand">&amp;</span><span>${escapeHTML(weddingData.groomName)}</span>`;
    $("#heroDate").textContent = formattedDate(weddingData.weddingDate);
    $("#countdownDate").textContent = formattedDate(weddingData.weddingDate);
    $("#ceremonyDate").textContent = formattedDate(weddingData.weddingDate);
    $("#ceremonyMuhurat").textContent = weddingData.muhurat;
    $("#ceremonyVenue").textContent = weddingData.venueName;
    $("#venueName").textContent = weddingData.venueName;
    $("#venueAddress").textContent = weddingData.venueAddress;
    $("#venueDate").textContent = formattedDate(weddingData.weddingDate);
    $("#venuePhoto").style.backgroundImage = `url("${staticAssetPath(weddingData.heroImage, "image", defaultWeddingData.heroImage)}")`;
    $("#videoImage").style.backgroundImage = `url("${staticAssetPath(weddingData.heroImage, "image", defaultWeddingData.heroImage)}")`;
    $("#footerNames").textContent = `${weddingData.brideName} & ${weddingData.groomName} · ${formattedDate(weddingData.weddingDate, { year: "numeric" })}`;
    const mapUrl = safeUrl(weddingData.googleMapsUrl, "https://maps.google.com/");
    $("#ceremonyMap").href = mapUrl;
    $("#venueMap").href = mapUrl;
    $("#directionsLink").href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(weddingData.venueAddress)}`;
    $("#coupleCards").innerHTML = `
        <article class="person-card reveal"><div class="person-image-wrap"><img class="person-image" src="${escapeHTML(staticAssetPath(weddingData.bridePhoto, "image", defaultWeddingData.bridePhoto))}" alt="${escapeHTML(weddingData.brideName)}" loading="lazy"></div><h3>${escapeHTML(weddingData.brideName)}</h3><p>A kind heart, a curious spirit, and the one who makes every day feel like home.</p></article>
        <div class="couple-divider" aria-hidden="true"><span>♡</span><span>together</span></div>
        <article class="person-card reveal"><div class="person-image-wrap"><img class="person-image" src="${escapeHTML(staticAssetPath(weddingData.groomPhoto, "image", defaultWeddingData.groomPhoto))}" alt="${escapeHTML(weddingData.groomName)}" loading="lazy"></div><h3>${escapeHTML(weddingData.groomName)}</h3><p>A warm smile, a generous soul, and the one who feels like every adventure.</p></article>`;
    $("#eventCards").innerHTML = weddingData.events.map((event, index) => {
        const eventMap = safeUrl(event.mapsUrl || weddingData.googleMapsUrl, "https://maps.google.com/");
        return `<article class="event-card reveal"><span class="event-number">0${index + 1}</span><h3>${escapeHTML(event.name)}</h3><p class="event-meta">${escapeHTML(event.date)} <span aria-hidden="true">·</span> ${escapeHTML(event.time)}</p><p>${escapeHTML(event.description)}</p><div class="event-location"><span>${escapeHTML(event.venue || weddingData.venueName)}</span><a href="${escapeHTML(eventMap)}" target="_blank" rel="noopener">Map ↗</a></div></article>`;
    }).join("");
    $("#storyTimeline").innerHTML = weddingData.story.map(item => `<article class="story-item reveal"><div class="story-content"><span class="story-year">${escapeHTML(item.date)}</span><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.description)}</p></div><span class="story-dot" aria-hidden="true"></span></article>`).join("");
    $("#galleryGrid").innerHTML = weddingData.gallery.map((image, index) => `<button class="gallery-tile reveal" type="button" data-gallery-index="${index}" aria-label="Open wedding photograph ${index + 1}"><img src="${escapeHTML(staticAssetPath(image, "image", defaultWeddingData.gallery[index] || defaultWeddingData.heroImage))}" alt="Wedding memory ${index + 1}" loading="lazy"></button>`).join("");
    $$("#coupleCards img, #galleryGrid img").forEach(image => image.addEventListener("error", () => {
        image.hidden = true;
        const tile = image.closest(".gallery-tile");
        if (tile) {
            tile.disabled = true;
            tile.removeAttribute("data-gallery-index");
            tile.setAttribute("aria-label", "Photo will be added soon");
        }
    }, { once: true }));
    $("#familyCards").innerHTML = [weddingData.brideFamily, weddingData.groomFamily].map(family => `<article class="family-card reveal"><span class="family-symbol" aria-hidden="true">✿</span><h3>${escapeHTML(family.title)}</h3><p class="family-parent">${escapeHTML(family.father)}</p><span class="family-relation">${escapeHTML(family.mother)}</span><p class="family-members">${escapeHTML(family.members)}</p></article>`).join("");
    $("#giftSection").hidden = !weddingData.showGiftSection;
    $("#upiDisplay").textContent = weddingData.upiId || "UPI details to be shared soon";
    const musicPath = staticAssetPath(weddingData.music, "audio", "");
    const audio = $("#weddingAudio");
    if (musicPath && audio.getAttribute("src") !== musicPath) {
        audio.setAttribute("src", musicPath);
        audio.load();
    } else if (!musicPath) {
        audio.removeAttribute("src");
    }
    $("#videoPlay").dataset.video = staticAssetPath(weddingData.weddingVideo, "video", "");
    refreshReveals();
    updateCountdown();
}

function updateCountdown() {
    const target = dateObject(weddingData.weddingDate);
    const container = $("#countdown");
    if (!target) { container.innerHTML = `<p class="big-day">Date to be announced</p>`; return; }
    const secondsLeft = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000));
    if (secondsLeft <= 0) { container.innerHTML = `<p class="big-day">Today is the Big Day! <span aria-hidden="true">♥</span></p>`; return; }
    const values = [Math.floor(secondsLeft / 86400), Math.floor((secondsLeft % 86400) / 3600), Math.floor((secondsLeft % 3600) / 60), secondsLeft % 60];
    container.innerHTML = values.map((value, index) => `<div class="time-unit"><strong>${String(value).padStart(2, "0")}</strong><span>${["Days", "Hours", "Minutes", "Seconds"][index]}</span></div>`).join("");
}

let revealObserver;
function refreshReveals() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach(element => element.classList.add("is-visible")); return; }
    if (!revealObserver) revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
    }), { threshold: .12 });
    $$(".reveal:not(.is-visible)").forEach(element => revealObserver.observe(element));
}

function buildEditor() {
    if (!isAdminMode) return;
    $$('[data-key]', $("#editForm")).forEach(input => {
        const value = weddingData[input.dataset.key];
        if (input.type === "checkbox") input.checked = Boolean(value);
        else input.value = input.dataset.key === "weddingDate" ? localDateTime(value) : value || "";
    });
    $("#eventEditor").innerHTML = weddingData.events.map((event, index) => `<div class="event-editor-item"><strong>Event ${index + 1}</strong><label>Name<input data-array="events" data-index="${index}" data-prop="name" value="${escapeHTML(event.name)}"></label><label>Date<input data-array="events" data-index="${index}" data-prop="date" value="${escapeHTML(event.date)}"></label><label>Time<input data-array="events" data-index="${index}" data-prop="time" value="${escapeHTML(event.time)}"></label><label>Venue<input data-array="events" data-index="${index}" data-prop="venue" value="${escapeHTML(event.venue)}"></label><label>Description<textarea data-array="events" data-index="${index}" data-prop="description" rows="2">${escapeHTML(event.description)}</textarea></label><label>Event map URL<input data-array="events" data-index="${index}" data-prop="mapsUrl" value="${escapeHTML(event.mapsUrl || "")}"></label></div>`).join("");
    $("#storyEditor").innerHTML = weddingData.story.map((item, index) => `<div class="story-editor-item"><strong>Story moment ${index + 1}</strong><label>Title<input data-array="story" data-index="${index}" data-prop="title" value="${escapeHTML(item.title)}"></label><label>Date or year<input data-array="story" data-index="${index}" data-prop="date" value="${escapeHTML(item.date)}"></label><label>Description<textarea data-array="story" data-index="${index}" data-prop="description" rows="2">${escapeHTML(item.description)}</textarea></label></div>`).join("");
    $("#galleryEditor").innerHTML = weddingData.gallery.map((image, index) => `<div class="gallery-editor-item"><label>Gallery image ${index + 1} preview<input type="file" accept="image/*" data-gallery-upload="${index}"><small>Local preview only; copy the photo into assets/images/ to publish.</small></label><input data-gallery-url="${index}" aria-label="Gallery image ${index + 1} path" value="${escapeHTML(image)}"></div>`).join("");
}

function showToast(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function openEditor() {
    if (!isAdminMode) return;
    $("#editPanel").classList.add("is-open");
    $("#editPanel").setAttribute("aria-hidden", "false");
    $("#panelBackdrop").hidden = false;
    document.body.classList.add("panel-open");
    $("#panelClose").focus();
}
function closeEditor() {
    if (!isAdminMode) return;
    $("#editPanel").classList.remove("is-open");
    $("#editPanel").setAttribute("aria-hidden", "true");
    $("#panelBackdrop").hidden = true;
    document.body.classList.remove("panel-open");
}

function persistChanges() {
    if (!isAdminMode) return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weddingData));
        $("#editorStatus").textContent = "Saved on this device.";
        $("#editorStatus").classList.remove("is-error");
        showToast("Invitation changes saved.");
    } catch (error) {
        $("#editorStatus").textContent = "Could not save. Image data may exceed this browser's storage limit; use smaller images or the assets folder instead.";
        $("#editorStatus").classList.add("is-error");
    }
}

async function copyText(text, successMessage) {
    try { await navigator.clipboard.writeText(text); }
    catch (error) {
        const temporary = document.createElement("textarea");
        temporary.value = text;
        temporary.style.position = "fixed";
        temporary.style.opacity = "0";
        document.body.append(temporary);
        temporary.select();
        document.execCommand("copy");
        temporary.remove();
    }
    showToast(successMessage);
}

function openLightbox(index) {
    const images = weddingData.gallery;
    if (!images.length) return;
    const imageIndex = (index + images.length) % images.length;
    $("#lightboxImage").src = safeUrl(images[imageIndex]);
    $("#lightboxCount").textContent = `${imageIndex + 1} / ${images.length}`;
    $("#lightbox").dataset.index = imageIndex;
    $("#lightbox").classList.add("is-open");
    $("#lightbox").setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    $("#lightboxClose").focus();
}
function closeLightbox() {
    $("#lightbox").classList.remove("is-open");
    $("#lightbox").setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
}

function updateMusicControls() {
    const audio = $("#weddingAudio");
    const playing = !audio.paused;
    const musicButton = $("#musicToggle");
    const muteButton = $("#musicMuteToggle");
    musicButton.classList.toggle("is-playing", playing);
    musicButton.setAttribute("aria-label", playing ? "Pause wedding music" : "Play wedding music");
    musicButton.title = playing ? "Pause wedding music" : "Play wedding music";
    muteButton.classList.toggle("is-muted", audio.muted);
    muteButton.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
    muteButton.title = audio.muted ? "Unmute music" : "Mute music";
    muteButton.querySelector("span").textContent = audio.muted ? "◖×" : "◖))";
    $("#musicStatus").textContent = playing ? (audio.muted ? "Music playing, muted" : "Music playing") : "Music paused";
}

async function startWedding() {
    const audio = $("#weddingAudio");
    if (!audio.getAttribute("src")) {
        showToast("Add an MP3 file at assets/music/wedding-music.mp3 to play music.");
        return;
    }
    try {
        await audio.play();
        updateMusicControls();
    } catch (error) {
        console.warn("Wedding music could not be played.", error);
        showToast("Music could not play. Check that assets/music/wedding-music.mp3 is a valid MP3.");
        updateMusicControls();
    }
}

function setupInteractions() {
    if (isAdminMode) {
        $("#adminControls").hidden = false;
        $("#editTrigger").addEventListener("click", openEditor);
        $("#panelClose").addEventListener("click", closeEditor);
        $("#panelBackdrop").addEventListener("click", closeEditor);
        $("#saveChanges").addEventListener("click", persistChanges);
        $("#resetChanges").addEventListener("click", () => {
            if (!isAdminMode) return;
            Object.keys(weddingData).forEach(key => delete weddingData[key]);
            Object.assign(weddingData, JSON.parse(JSON.stringify(defaultWeddingData)));
            localStorage.removeItem(STORAGE_KEY);
            buildEditor();
            renderInvitation();
            $("#editorStatus").textContent = "Restored the original example invitation.";
            showToast("Example invitation restored.");
        });
        $("#exitAdmin").addEventListener("click", () => {
            if (!isAdminMode) return;
            const nextUrl = new URL(window.location.href);
            nextUrl.searchParams.delete("admin");
            window.location.replace(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        });
        $("#editForm").addEventListener("input", event => {
            if (!isAdminMode) return;
            const target = event.target;
            if (target.dataset.key) weddingData[target.dataset.key] = target.type === "checkbox" ? target.checked : target.value;
            if (target.dataset.array) weddingData[target.dataset.array][Number(target.dataset.index)][target.dataset.prop] = target.value;
            if (target.dataset.galleryUrl !== undefined) weddingData.gallery[Number(target.dataset.galleryUrl)] = target.value;
            renderInvitation();
        });
        $("#editForm").addEventListener("change", event => {
            if (!isAdminMode) return;
            const target = event.target;
            const file = target.files && target.files[0];
            if (!file || (!target.dataset.image && target.dataset.galleryUpload === undefined)) return;
            if (!file.type.startsWith("image/")) { showToast("Choose an image file."); return; }
            if (file.size > 700 * 1024) { showToast("Please choose an image smaller than 700 KB."); target.value = ""; return; }
            const reader = new FileReader();
            reader.onload = () => {
                if (!isAdminMode) return;
                if (target.dataset.image) weddingData[target.dataset.image] = reader.result;
                else weddingData.gallery[Number(target.dataset.galleryUpload)] = reader.result;
                if (target.dataset.image) $(`[data-key="${target.dataset.image}"]`, $("#editForm")).value = "";
                const galleryInput = target.dataset.galleryUpload;
                if (galleryInput !== undefined) $(`[data-gallery-url="${galleryInput}"]`, $("#editForm")).value = "Uploaded image on this device";
                renderInvitation();
                showToast("Image preview updated. Save to keep it on this device.");
            };
            reader.readAsDataURL(file);
        });
    } else {
        $("#adminControls")?.remove();
    }
    $("#menuToggle").addEventListener("click", () => {
        const isOpen = $("#menuToggle").getAttribute("aria-expanded") === "true";
        $("#menuToggle").setAttribute("aria-expanded", String(!isOpen));
        $("#menuToggle").setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
        $("#mainNav").classList.toggle("is-open", !isOpen);
    });
    $$("#mainNav a").forEach(link => link.addEventListener("click", () => {
        $("#mainNav").classList.remove("is-open");
        $("#menuToggle").setAttribute("aria-expanded", "false");
        $("#menuToggle").setAttribute("aria-label", "Open navigation");
    }));
    $("#rsvpForm").addEventListener("submit", event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const number = weddingData.whatsappNumber.replace(/\D/g, "");
        if (!number || /X/i.test(weddingData.whatsappNumber)) { showToast("RSVP is not available just yet. Please contact the couple directly."); return; }
        const message = [
            `Wedding RSVP for ${weddingData.brideName} & ${weddingData.groomName}`,
            `Name: ${values.get("guestName")}`,
            `Guests: ${values.get("guestCount")}`,
            `Phone: ${values.get("phone") || "Not provided"}`,
            `Attendance: ${values.get("attending")}`,
            `Message: ${values.get("message") || "No message"}`
        ].join("\n");
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    });
    $("#shareToggle").addEventListener("click", () => { $("#shareMenu").hidden = !$("#shareMenu").hidden; });
    $("#shareMenu").addEventListener("click", async event => {
        const action = event.target.closest("[data-share]")?.dataset.share;
        if (!action) return;
        const inviteText = "We are getting married! Join us to celebrate our special day ❤️";
        const link = window.location.href.split("#")[0];
        if (action === "whatsapp") window.open(`https://wa.me/?text=${encodeURIComponent(`${inviteText} ${link}`)}`, "_blank", "noopener,noreferrer");
        if (action === "copy") await copyText(link, "Invitation link copied.");
        if (action === "instagram") { await copyText(`${inviteText} ${link}`, "Invitation text copied. Paste it into your Instagram post or story."); window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer"); }
        if (action === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`, "_blank", "noopener,noreferrer");
        $("#shareMenu").hidden = true;
    });
    $("#copyUpi").addEventListener("click", () => weddingData.upiId ? copyText(weddingData.upiId, "UPI ID copied.") : showToast("UPI details have not been added yet."));
    $("#musicToggle").addEventListener("click", async () => {
        const audio = $("#weddingAudio");
        if (audio.paused) await startWedding();
        else audio.pause();
        updateMusicControls();
    });
    $("#musicMuteToggle").addEventListener("click", () => {
        $("#weddingAudio").muted = !$("#weddingAudio").muted;
        updateMusicControls();
    });
    $("#enterInvitation").addEventListener("click", () => startWedding());
    $("#weddingAudio").addEventListener("play", updateMusicControls);
    $("#weddingAudio").addEventListener("pause", updateMusicControls);
    $("#weddingAudio").addEventListener("volumechange", updateMusicControls);
    $("#weddingAudio").addEventListener("error", () => {
        updateMusicControls();
        showToast("Music file not found or unsupported. Check assets/music/wedding-music.mp3.");
    });
    $("#galleryGrid").addEventListener("click", event => {
        const tile = event.target.closest("[data-gallery-index]");
        if (tile) openLightbox(Number(tile.dataset.galleryIndex));
    });
    $("#lightboxClose").addEventListener("click", closeLightbox);
    $("#lightboxImage").addEventListener("error", () => {
        closeLightbox();
        showToast("This photo is not available. Add it under assets/images/ and deploy again.");
    });
    $("#lightboxPrev").addEventListener("click", () => openLightbox(Number($("#lightbox").dataset.index) - 1));
    $("#lightboxNext").addEventListener("click", () => openLightbox(Number($("#lightbox").dataset.index) + 1));
    $("#lightbox").addEventListener("click", event => { if (event.target === $("#lightbox")) closeLightbox(); });
    $("#videoPlay").addEventListener("click", event => {
        const videoUrl = event.currentTarget.dataset.video;
        if (!videoUrl) { showToast("Our wedding film will be shared soon."); return; }
        window.open(videoUrl, "_blank", "noopener,noreferrer");
    });
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") { closeEditor(); closeLightbox(); $("#shareMenu").hidden = true; }
        if ($("#lightbox").classList.contains("is-open") && event.key === "ArrowRight") openLightbox(Number($("#lightbox").dataset.index) + 1);
        if ($("#lightbox").classList.contains("is-open") && event.key === "ArrowLeft") openLightbox(Number($("#lightbox").dataset.index) - 1);
    });
}

function makePetals() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const field = $("#petalField");
    for (let index = 0; index < 9; index += 1) {
        const petal = document.createElement("span");
        petal.className = "petal";
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDelay = `${Math.random() * 16}s`;
        petal.style.animationDuration = `${16 + Math.random() * 13}s`;
        field.append(petal);
    }
}

if (isAdminMode) buildEditor();
renderInvitation();
setupInteractions();
makePetals();
setInterval(updateCountdown, 1000);
setTimeout(() => $("#loadingScreen").classList.add("is-done"), 1700);