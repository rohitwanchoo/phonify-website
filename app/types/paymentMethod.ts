export interface PaymentMethod {
  payment_method_id?: string
  id: string
  full_name: string
  number?: string
  exp_month: number | string
  exp_year: number | string
  cvc?: string
  country: string
  city: string
  postal_code: string
  state: string
  line1: string
}
