exports.resetEmailHtml = function (user, code) {
    return(`
        <p>Hi ${user},<br><br><br>
        
        We've received a request to reset the password for your account.<br>
        If this was not you, you can ignore this email.
        <br><br>
        To reset your password enter the code provided below into the website:<br/>
        <h1>${code}</h1>
        </p>
        `
    )
};

exports.resetEmailText = function (user, code) {
  return(
  `Hi ${user},
        
  We've received a request to reset the password for your account.
  If this was not you, you can ignore this email.
  To reset your password enter the code provided below into the website:
  ${code}
  `
  );
};


exports.supplierEmailHtml = function (products, comments) {
  return(
    `<span>Γεια σας,</span>
    <p>Ελπίζω αυτό το email να σας βρίσκει καλα.</p>
    <p>Παρακάτω θα βρείτε την λίστα με τα προϊόντα που χρειαζόμαστε για παραγγελία:</p>
    <br>
    <br>
    <ul>
        ${products}
    </ul>
    <br>
    <br>
    <p>${comments}</p>
    <br>
    <p>Παρακαλούμε επιβεβαιώστε τη διαθεσιμότητα των προϊόντων και ενημερώστε μας για την αναμενόμενη ημερομηνία παράδοσης.
    Εάν υπάρξουν καθυστερήσεις,προβλήματα ή ερωτήσεις, παρακαλούμε όπως επικοινωνήσετε μαζί μας.</p>
    <p>Ευχαριστούμε πολύ,</p>
    <p>Ομάδα HOST</p>`
  );
};