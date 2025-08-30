const Joi = require('joi')

const newAdmin = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^0\d{9}$/).min(10).max(10).trim().required().messages({
    "string.pattern.base": "Phone number must be 10 digits and start with 0",
    "string.empty": "Phone number is required",
  }),
  gender: Joi.string().valid('male', 'female').required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password is required",
    }),
  location: Joi.object({
    address: Joi.string().trim().required(),
    ward: Joi.string().trim().required(),
    city: Joi.string().trim().required()
  })
})

const newReview = Joi.object({
  review: Joi.object({
    content: Joi.string().max(200).required().messages({
      'string.max': 'Review content cannot exceed 200 characters',
      'string.empty': 'Review content is required'
    }),
    rating: Joi.number().min(1).max(5).required().messages({
      'number.base': 'Rating must be a number',
      'number.min': 'Rating must be at least 1',
      'number.max': 'Rating cannot be more than 5',
      'any.required': 'Rating is required'
    })
  }).required(),
  orderId: Joi.string().required().messages({
    'string.empty': 'Order ID is required'
  }),
  productId: Joi.string().required().messages({
    'string.empty': 'Product ID is required'
  })
})

const newUser = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().min(10).max(10).trim().required(),
  gender: Joi.string().valid('male', 'female').required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base": "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password is required",
    }),
  passwordConfirmed: Joi.string().valid(Joi.ref('password')).required()
    .messages({ 'any.only': 'Password confirmation does not match password' }),
  location: Joi.object({
    address: Joi.string().trim().required(),
    ward: Joi.string().trim().required(),
    city: Joi.string().trim().required()
  }),
  role: Joi.optional()
})

const newFilterOptionsSchema = Joi.object({
  key: Joi.string().trim().required().messages({
    'string.base': 'Key must be a string',
    'string.empty': 'Key cannot be empty'
  }),
  label: Joi.string().trim().required().messages({
    'string.base': 'Label must be a string',
    'string.empty': 'Label cannot be empty'
  }),
  type: Joi.string().valid('checkbox', 'radio', 'range').required().messages({
    'any.only': 'Type must be "checkbox", "radio" or "range"',
    'string.empty': 'Type cannot be empty'
  }),
  values: Joi.array()
    .items(
      Joi.string().trim().required().messages({
        'string.base': 'Each value must be a string',
        'string.empty': 'Value cannot be empty'
      })
    )
    .messages({
      'array.base': 'Values must be an array of strings'
    })
})

const updateFilterOptionsSchema = Joi.array()
  .items(
    Joi.object({
      key: Joi.string().trim().required().messages({
        'string.base': 'Key must be a string',
        'string.empty': 'Key cannot be empty',
        'any.required': 'Key is required'
      }),
      label: Joi.string().trim().required().messages({
        'string.base': 'Label must be a string',
        'string.empty': 'Label cannot be empty',
        'any.required': 'Label is required'
      }),
      type: Joi.string().valid('checkbox', 'radio', 'range').required().messages({
        'any.only': 'Type must be "checkbox", "radio" or "range"',
        'string.empty': 'Type cannot be empty',
        'any.required': 'Type is required'
      }),
      values: Joi.array()
        .items(
          Joi.string().trim().required().messages({
            'string.base': 'Each value must be a string',
            'string.empty': 'Value cannot be empty'
          })
        )
        .messages({
          'array.base': 'Values must be an array of strings'
        }),
      path: Joi.string().trim().required().messages({
        'string.base': 'Path must be a string',
        'string.empty': 'Path cannot be empty',
        'any.required': 'Path is required'
      }),
      match: Joi.optional()
    }).unknown(false)
  )
  .min(1)
  .required()
  .messages({
    'array.base': 'Filters must be an array of objects',
    'array.min': 'At least one filter is required',
    'any.required': 'Filters are required'
  })

const voucherSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'string.base': 'Code must be a string',
    'string.empty': 'Code cannot be empty'
  }),
  description: Joi.string().trim().required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty'
  }),
  discountType: Joi.string().valid('percentage', 'fixed').required().messages({
    'any.only': 'Discount type must be "percentage" or "fixed"',
    'string.empty': 'Discount cannot be empty'
  }),
  discountValue: Joi.number().positive().required()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number().positive().less(100).messages({
        'number.less': 'Discount value must be less than 100 when type is percentage',
        'number.positive': 'Discount value must be greater than 0',
        'any.required': 'Discount value required',
        'number.base': 'Discount value must be a number'
      }),
      otherwise: Joi.number().positive().messages({
        'number.positive': 'Discount value must be greater than 0',
        'any.required': 'Discount value required',
        'number.base': 'Discount value must be a number'
      })
    }),
  maxDiscount: Joi.number().min(0).allow(null).messages({
    'number.base': 'Maximum discount must be a number',
    'number.min': 'Maximum discount cannot be negative'
  }),
  minOrderValue: Joi.number().min(0).allow(null).messages({
    'number.base': 'Minimum order value must be a number',
    'number.min': 'Minimum order value cannot be negative'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be an integer',
    'number.min': 'Quantity must be greater than 0'
  }),
  usageLimitPerUser: Joi.number().integer().min(1).optional().messages({
    'number.base': 'Limit per user must be an integer',
    'number.min': 'Limit per user must be = 1'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Invalid start date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'Invalid end date',
    'date.greater': 'End date must be after start date'
  }),
  categories: Joi.array().items(Joi.string().trim()).min(1).unique().required().messages({
    'array.base': 'Category must be an array',
    'array.min': 'Must contain at least one category',
    'array.unique': 'Cannot copy list'
  }),
  _id: Joi.any().optional(),
  createdAt: Joi.any().optional(),
  updatedAt: Joi.any().optional(),
  usageLimitPerUser: Joi.any().optional(),
  used: Joi.any().optional()
})

const newVoucherSchema = Joi.object({
  code: Joi.string().trim().required().messages({
    'string.base': 'Code must be a string',
    'string.empty': 'Code cannot be empty'
  }),
  description: Joi.string().trim().required().messages({
    'string.base': 'Description must be a string',
    'string.empty': 'Description cannot be empty'
  }),
  discountType: Joi.string().valid('percentage', 'fixed').required().messages({
    'any.only': 'Discount type must be "percentage" or "fixed"',
    'string.empty': 'Discount cannot be empty'
  }),
  discountValue: Joi.number().positive().required()
    .when('discountType', {
      is: 'percentage',
      then: Joi.number().positive().less(100).messages({
        'number.less': 'Discount value must be less than 100 when type is percentage',
        'number.positive': 'Discount value must be greater than 0',
        'any.required': 'Discount value required',
        'number.base': 'Discount value must be a number'
      }),
      otherwise: Joi.number().positive().messages({
        'number.positive': 'Discount value must be greater than 0',
        'any.required': 'Discount value required',
        'number.base': 'Discount value must be a number'
      })
    }),
  maxDiscount: Joi.number().min(0).allow(null).messages({
    'number.base': 'Maximum discount must be a number',
    'number.min': 'Maximum discount cannot be negative'
  }),
  minOrderValue: Joi.number().min(0).allow(null).messages({
    'number.base': 'Minimum order value must be a number',
    'number.min': 'Minimum order value cannot be negative'
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    'number.base': 'Quantity must be an integer',
    'number.min': 'Quantity must be greater than 0'
  }),
  usageLimitPerUser: Joi.number().integer().min(1).max(1).optional().messages({
    'number.base': 'Limit per user must be an integer',
    'number.min': 'Limit per user must be = 1'
  }),
  startDate: Joi.date().iso().required().messages({
    'date.base': 'Invalid start date',
    'any.required': 'Start date is required'
  }),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required().messages({
    'date.base': 'Invalid end date',
    'date.greater': 'End date must be after start date'
  }),
  categories: Joi.array().items(Joi.string().trim()).min(1).unique().required().messages({
    'array.base': 'Category must be an array',
    'array.min': 'Must contain at least one category',
    'array.unique': 'Cannot copy list'
  }),
  _id: Joi.any().optional(),
  createdAt: Joi.any().optional(),
  updatedAt: Joi.any().optional(),
  used: Joi.any().optional(),
  isActive: Joi.boolean().optional()
})

const baseProductSchema = Joi.object({
  model: Joi.string().required().messages({
    'string.empty': 'Product name is required'
  }),
  price: Joi.number().greater(0).required().messages({
    'number.base': 'Price must be a number',
    'number.greater': 'Price must be greater than 0'
  }),
  stock: Joi.number().integer().min(0).required().messages({
    'number.base': 'Stock must be a number',
    'number.min': 'Stock cannot be negative'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required'
  }),
  brand: Joi.string().required().messages({
    'string.empty': 'Brand is required'
  }),
  images: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'At least one image is required'
  }),
  _id: Joi.optional()
})

const phoneSchema = Joi.object({
  storage: Joi.string().required(),
  ram: Joi.string().required(),
  discount: Joi.number().min(0).optional(),
  configuration_and_memory: Joi.object({
    operating_system: Joi.string().required(),
    processor_chip: Joi.string().required(),
    graphics_chip: Joi.string().required()
  }).required(),
  camera_and_display: Joi.object({
    front_camera: Joi.string().required(),
    rear_camera: Joi.string().required(),
    lidar_scanner: Joi.boolean(),
    display_technology: Joi.string(),
    flash: Joi.boolean(),
    size: Joi.number(),
    brightness: Joi.string(),
    screen: Joi.string()
  }).required(),
  battery: Joi.object({
    capacity: Joi.number().required(),
    connector: Joi.string().required()
  }).required(),
  features: Joi.object({
    fingerprint_security: Joi.boolean(),
    face_recognition: Joi.boolean(),
    water_resistance: Joi.string(),
    support_5g: Joi.boolean(),
    fast_charging: Joi.string()
  }).required(),
  others: Joi.object({
    material: Joi.string(),
    weight: Joi.string(),
    dimensions: Joi.object({
      length: Joi.string(),
      width: Joi.string(),
      thickness: Joi.string()
    })
  }).required()
})

const laptopSchema = Joi.object({
  chip: Joi.string().required(),
  size: Joi.number().required(),
  processor: Joi.object({
    name: Joi.string().required(),
    coreThread: Joi.string(),
    frequency: Joi.string(),
    cache: Joi.string(),
    tdp: Joi.string()
  }).required(),
  ramAndStorage: Joi.object({
    ram: Joi.string().required(),
    ramSlots: Joi.number(),
    ramUpgrade: Joi.string(),
    storage: Joi.string().required(),
    storageUpgrade: Joi.string()
  }).required(),
  gpu_display: Joi.object({
    gpu: Joi.string(),
    gpuUpgrade: Joi.string(),
    panel: Joi.string(),
    brightness: Joi.string(),
    color: Joi.string(),
    refreshRate: Joi.string(),
    antiGlare: Joi.boolean(),
    touch: Joi.boolean()
  }).required(),
  others: Joi.object({
    battery: Joi.string(),
    ports: Joi.array().items(Joi.string()),
    os: Joi.string(),
    weight: Joi.string()
  }).required()
})

const productSchema = Joi.alternatives().conditional(Joi.object({ category: Joi.string().valid('Phone') }).unknown(), {
  then: baseProductSchema.concat(phoneSchema)
}).conditional(Joi.object({ category: Joi.string().valid('Laptop') }).unknown(), {
  then: baseProductSchema.concat(laptopSchema)
})

module.exports = {
  newReview,
  newUser,
  newAdmin,
  newFilterOptionsSchema,
  updateFilterOptionsSchema,
  voucherSchema,
  newVoucherSchema,
  phoneSchema,
  laptopSchema,
  productSchema
}