;; ip-registration.clar

;; Define data structures
(define-map ip-registrations
  {id: uint}
  {
    owner: principal,
    title: (string-ascii 256),
    description: (string-ascii 1024),
    creation-date: uint,
    registration-date: uint,
    status: (string-ascii 20)
  }
)

(define-data-var next-ip-id uint u0)

;; Functions for managing IP registrations
(define-public (register-ip (title (string-ascii 256)) (description (string-ascii 1024)))
  (let
    (
      (ip-id (var-get next-ip-id))
    )
    (map-set ip-registrations
      {id: ip-id}
      {
        owner: tx-sender,
        title: title,
        description: description,
        creation-date: block-height,
        registration-date: block-height,
        status: "registered"
      }
    )
    (var-set next-ip-id (+ ip-id u1))
    (ok ip-id)
  )
)

(define-public (update-ip-status (ip-id uint) (new-status (string-ascii 20)))
  (let
    (
      (ip (unwrap! (map-get? ip-registrations {id: ip-id}) (err u404)))
    )
    (asserts! (is-eq (get owner ip) tx-sender) (err u403))
    (ok (map-set ip-registrations
      {id: ip-id}
      (merge ip {status: new-status})
    ))
  )
)

(define-read-only (get-ip-registration (ip-id uint))
  (map-get? ip-registrations {id: ip-id})
)
