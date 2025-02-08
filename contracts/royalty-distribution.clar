;; royalty-distribution.clar

;; Define data structures
(define-map royalty-payments
  {id: uint}
  {
    license-id: uint,
    amount: uint,
    paid-at: uint,
    status: (string-ascii 20)
  }
)

(define-map royalty-balances
  {owner: principal}
  {balance: uint}
)

(define-data-var next-payment-id uint u0)

;; Functions for managing royalty payments
(define-public (record-royalty-payment (license-id uint) (amount uint))
  (let
    (
      (payment-id (var-get next-payment-id))
      (license (unwrap! (contract-call? .licensing get-license license-id) (err u404)))
    )
    (map-set royalty-payments
      {id: payment-id}
      {
        license-id: license-id,
        amount: amount,
        paid-at: block-height,
        status: "recorded"
      }
    )
    (var-set next-payment-id (+ payment-id u1))
    (ok payment-id)
  )
)

(define-public (distribute-royalty (payment-id uint))
  (let
    (
      (payment (unwrap! (map-get? royalty-payments {id: payment-id}) (err u404)))
      (license (unwrap! (contract-call? .licensing get-license (get license-id payment)) (err u404)))
    )
    (asserts! (is-eq (get status payment) "recorded") (err u400))
    (try! (stx-transfer? (get amount payment) tx-sender (get licensor license)))
    (map-set royalty-payments
      {id: payment-id}
      (merge payment {status: "distributed"})
    )
    (ok true)
  )
)

(define-read-only (get-royalty-payment (payment-id uint))
  (map-get? royalty-payments {id: payment-id})
)

(define-read-only (get-royalty-balance (owner principal))
  (default-to {balance: u0} (map-get? royalty-balances {owner: owner}))
)

