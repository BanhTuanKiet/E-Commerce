const voucherStatusIcons = {
  total: {
    icon: "bi bi-collection",
    color: "text-primary",
    description: "Total number of vouchers"
  },
  active: {
    icon: "bi bi-check-circle",
    color: "text-success",
    description: "Currently active vouchers"
  },
  pause: {
    icon: "bi bi-pause-circle",
    color: "text-warning",
    description: "Temporarily paused vouchers"
  },
  expired: {
    icon: "bi bi-x-circle",
    color: "text-danger",
    description: "Vouchers that have expired"
  },
  upcoming: {
    icon: "bi bi-clock",
    color: "text-info",
    description: "Vouchers starting soon"
  }
}

const productStatusIcons = {
  total: { icon: "bi bi-boxes", color: "text-primary", description: "Total number of products available" },
  inStock: { icon: "bi bi-check-circle", color: "text-success", description: "Products currently in stock" },
  lowStock: { icon: "bi bi-exclamation-triangle", color: "text-warning", description: "Low stock quantity" },
  outOfStock: { icon: "bi bi-x-circle", color: "text-danger", description: "Products out of stock" },
  sale: { icon: "bi bi-tags", color: "text-info", description: "Products on sale" },
  new: { icon: "bi bi-star", color: "text-secondary", description: "Newly arrived products" }
}

const orderStatusIcons = {
  processing: { icon: "bi bi-boxes", color: "text-primary", description: "Order is being processed" },
  confirmed: { icon: "bi bi-check-circle", color: "text-success", description: "Order has been confirmed" },
  shipping: { icon: "bi bi-exclamation-triangle", color: "text-warning", description: "Order is being shipped" },
  delivered: { icon: "bi bi-x-circle", color: "text-danger", description: "Order has been delivered" },
  cancelled: { icon: "bi bi-tags", color: "text-info", description: "Order has been cancelled" },
}

export const itemStatusIcons = {
  product: productStatusIcons,
  order: orderStatusIcons,
  voucher: voucherStatusIcons
}