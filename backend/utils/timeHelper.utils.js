export const convertTo24Hour = (time) => {
    if (!time) return "00:00";
    if (!time.toLowerCase().includes("am") && !time.toLowerCase().includes("pm")) {
        return time;
    }
    const [timePart, modifier] = time.trim().split(" ");
    let [hours, minutes] = timePart.split(":");
    hours = parseInt(hours);
    minutes = minutes || "00";
    if (modifier.toLowerCase() === "am") {
        if (hours === 12) hours = 0;
    } else if (modifier.toLowerCase() === "pm") {
        if (hours !== 12) hours += 12;
    }
    return `${String(hours).padStart(2, "0")}:${minutes}`;
};

export const calculateAmount = (checkIn, checkOut, checkInTime, checkOutTime, pricePerNight) => {
    const checkInTime24 = convertTo24Hour(checkInTime || "14:00");
    const checkOutTime24 = convertTo24Hour(checkOutTime || "11:00");

    const checkInDateTime = new Date(`${checkIn}T${checkInTime24}:00`);
    const checkOutDateTime = new Date(`${checkOut}T${checkOutTime24}:00`);

    const diffMs = checkOutDateTime - checkInDateTime;

    if (diffMs <= 0) return { hours: 0, nights: 0, totalAmount: 0, billingType: null };

    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    const hourlyRate = pricePerNight / 24;
    if (diffDays < 1) {
        const hours = Math.ceil(diffHours);
        const totalAmount = Math.round(hourlyRate * hours);
        return {
            hours,
            nights: 0,
            totalAmount,
            billingType: "hourly",
            hourlyRate: Math.round(hourlyRate)
        };
    }
    const nights = Math.ceil(diffDays);
    const totalAmount = pricePerNight * nights;
    return {
        hours: Math.round(diffHours),
        nights,
        totalAmount,
        billingType: "nightly",
        hourlyRate: Math.round(hourlyRate)
    };
};