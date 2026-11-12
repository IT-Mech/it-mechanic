(function () {
  var site = window.SITE;
  if (!site) return;

  var cityLine = [site.city, site.region, site.country].filter(Boolean).join(", ");
  var streetLine = [site.street, site.suburb, site.city, site.postcode]
    .filter(Boolean)
    .join(", ");
  var hasStreet = Boolean(site.street);
  var phoneHref = site.phoneTel ? "tel:" + site.phoneTel : "";
  var mailHref = site.email ? "mailto:" + site.email : "";

  document.title = site.name + " | IT support in " + site.city;

  var description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute(
      "content",
      site.name + " is a locally owned IT service provider in " + site.city +
      ". Computer consultancy for devices, networks, and accounts. Call " +
      site.phoneDisplay + "."
    );
  }

  setText("[data-field='name']", site.name);
  var heading = document.querySelector("h1");
  if (heading && site.name) {
    var bits = site.name.split(" ");
    heading.replaceChildren();
    if (bits.length > 1) {
      var emphasis = document.createElement("span");
      emphasis.textContent = bits[0];
      heading.append(emphasis, document.createTextNode(bits.slice(1).join(" ")));
    } else {
      heading.textContent = site.name;
    }
  }
  setText("[data-field='legal']", site.legalName);
  setText("[data-field='city']", site.city);
  setText("[data-field='city-line']", cityLine);
  setText("[data-field='nzbn']", site.nzbn);
  setText("[data-field='company-number']", site.companyNumber);
  setText("[data-field='phone']", site.phoneDisplay);
  setText("[data-field='contact']", site.contactName || "us");

  document.querySelectorAll("[data-field='phone-link']").forEach(function (node) {
    if (phoneHref) node.setAttribute("href", phoneHref);
    var label = node.getAttribute("data-label");
    node.textContent = label ? label + " " + site.phoneDisplay : site.phoneDisplay;
  });

  var emailRow = document.querySelector("[data-block='email']");
  if (emailRow) {
    if (site.email) {
      emailRow.hidden = false;
      var emailLink = emailRow.querySelector("a");
      if (emailLink) {
        emailLink.href = mailHref;
        emailLink.textContent = site.email;
      }
    } else {
      emailRow.hidden = true;
    }
  }

  var streetBlock = document.querySelector("[data-block='street']");
  if (streetBlock) {
    streetBlock.hidden = !hasStreet;
    setText("[data-field='street']", streetLine);
  }

  var mapLink = document.querySelector("[data-field='map']");
  if (mapLink) {
    if (hasStreet) {
      mapLink.hidden = false;
      mapLink.href =
        "https://www.google.com/maps/search/?api=1&query=" +
        encodeURIComponent(streetLine + ", " + site.country);
    } else {
      mapLink.hidden = true;
    }
  }

  renderCards(document.querySelector("[data-list='services']"), site.services);
  renderCards(document.querySelector("[data-list='reasons']"), site.reasons);
  renderHours();
  writeJsonLd();

  function renderCards(list, items) {
    if (!list || !items) return;
    list.replaceChildren();
    items.forEach(function (item, index) {
      var card = document.createElement("article");
      card.className = "card";
      var num = document.createElement("p");
      num.className = "card-num";
      num.textContent = String(index + 1).padStart(2, "0");
      var title = document.createElement("h3");
      title.textContent = item.title;
      var text = document.createElement("p");
      text.textContent = item.text;
      card.append(num, title, text);
      list.appendChild(card);
    });
  }

  function renderHours() {
    var table = document.querySelector("[data-list='hours']");
    var status = document.querySelector("[data-field='open-status']");
    if (!site.publishHours) {
      document.querySelectorAll("[data-field='hours-note']").forEach(function (node) {
        node.hidden = false;
        node.textContent = site.hoursNote;
      });
      if (table) table.hidden = true;
      if (status) status.hidden = true;
      return;
    }
    document.querySelectorAll("[data-field='hours-note']").forEach(function (node) {
      node.hidden = true;
    });
    if (table) {
      table.hidden = false;
      table.replaceChildren();
      site.hours.forEach(function (row) {
        var item = document.createElement("div");
        item.className = "hours-row";
        var day = document.createElement("dt");
        day.textContent = row.day;
        var time = document.createElement("dd");
        time.textContent = row.open && row.close
          ? formatTime(row.open) + " – " + formatTime(row.close)
          : "Closed";
        item.append(day, time);
        table.appendChild(item);
      });
    }
    if (status) {
      var state = openState(site.hours);
      status.hidden = false;
      status.textContent = state;
      status.classList.toggle("is-open", state.indexOf("Open now") === 0);
    }
  }

  function openState(hours) {
    var parts = new Intl.DateTimeFormat("en-NZ", {
      timeZone: "Pacific/Auckland",
      weekday: "long",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(new Date());
    var weekday = part(parts, "weekday");
    var now = part(parts, "hour") + ":" + part(parts, "minute");
    var today = hours.find(function (row) { return row.day === weekday; });
    if (today && today.open && today.close && now >= today.open && now < today.close) {
      return "Open now · closes " + formatTime(today.close);
    }
    for (var offset = 1; offset <= 7; offset += 1) {
      var name = nextWeekday(weekday, offset);
      var row = hours.find(function (item) { return item.day === name; });
      if (row && row.open) {
        var when = offset === 1 ? "tomorrow" : name;
        return "Closed now · opens " + when + " " + formatTime(row.open);
      }
    }
    return "Closed now";
  }

  function nextWeekday(current, offset) {
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var index = days.indexOf(current);
    return days[(index + offset) % 7];
  }

  function formatTime(value) {
    var bits = value.split(":");
    var hour = Number(bits[0]);
    var minute = bits[1];
    var suffix = hour >= 12 ? "pm" : "am";
    var hour12 = hour % 12 || 12;
    return hour12 + ":" + minute + " " + suffix;
  }

  function part(parts, type) {
    var found = parts.find(function (item) { return item.type === type; });
    return found ? found.value : "";
  }

  function writeJsonLd() {
    var data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: site.name,
      legalName: site.legalName,
      telephone: site.phoneTel,
      areaServed: site.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: "NZ"
      },
      identifier: site.nzbn,
      url: "https://itmech.nz/"
    };
    if (site.email) data.email = site.email;
    if (hasStreet) data.address.streetAddress = streetLine;
    var node = document.getElementById("site-jsonld");
    if (node) node.textContent = JSON.stringify(data);
  }

  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(function (node) {
      node.textContent = value || "";
    });
  }
})();
