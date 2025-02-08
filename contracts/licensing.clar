;; licensing.clar

;; Define data structures
(define-map licenses
  {id: uint}
  {
    ip-id: uint,
    licensor: principal,
    licensee: principal,
    terms: (string-ascii 1024),
    start-date: uint,
    end-date: uint,
    status: (string-ascii 20)
  }
)

(define-data-var next-license-id uint u0)

;; Functions for managing licenses
(define-public (create-license (ip-id uint) (licensee principal) (terms (string-ascii 1024)) (duration uint))
  (let
    (
      (license-id (var-get next-license-id))
    )
    (map-set licenses
      {id: license-id}
      {
        ip-id: ip-id,
        licensor: tx-sender,
        licensee: licensee,
        terms: terms,
        start-date: block-height,
        end-date: (+ block-height duration),
        status: "active"
      }
    )
    (var-set next-license-id (+ license-id u1))
    (ok license-id)
  )
)

(define-public (update-license-status (license-id uint) (new-status (string-ascii 20)))
  (let
    (
      (license (unwrap! (map-get? licenses {id: license-id}) (err u404)))
    )
    (asserts! (or (is-eq (get licensor license) tx-sender) (is-eq (get licensee license) tx-sender)) (err u403))
    (ok (map-set licenses
      {id: license-id}
      (merge license {status: new-status})
    ))
  )
)

(define-read-only (get-license (license-id uint))
  (map-get? licenses {id: license-id})
)

