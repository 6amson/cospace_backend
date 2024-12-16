
export enum UserActivityType {
    PASSWORD_RESET = 'Password Update',
    UPDATE_EMAIL = 'Email Update',
    UPDATE_PROFILE_PICTURE = 'Profile picture Update',
    UPDATE_FIRSTNAME = 'First Name Update',
    UPDATE_LASTNAME = 'Last Name Update',
    UPDATE_PHONENUMBER = 'Phone Number Update',
    VIEW_SELF_LISTING = 'View Self Listing Details',
    VIEW_APARTMENT_LISTING = 'View Apartment Listing Details',
    LOGIN = 'Login',
    LOGOUT = 'Logout',
    DELETE_ACCOUNT = 'Delete Account',
    RESET_PASSWORD = 'Reset Password',
    PUSH_NOTIFICATION_ACTIVATE = 'Subscribed To Push Notification',
    PUSH_NOTIFICATION_DEACTIVATE = 'Unsubscribed From Push Notification',
    ACCEPT_STORE_TERMS = 'Accept Store Terms',
    ACCEPT_APP_TERMS = 'Accept App Terms',
    REPORT_ISSUE = 'Report App Issue',
}

export enum VerificationReason {
    VERIFY_EMAIL = "verifyEmail",
    PASSSWORD_RESET = 'changePasword'
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    NON_BINARY = 'Non binary',
    OTHERS = 'others',
    PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum EmailTypeKey {
    verifyEmail = 'verifyEmail',
    passwordReset = 'passwordReset',
    resendEmailVerificationCode = 'resendEmailVerificationCode',
    listingSuccess = 'listingSuccess',
    listingDelisted = 'listingDelisted',
    welcome = 'signup success'
}

export enum ComplaintsType {
    SEXUAL_ASSAULT = 'Sexual Assault',
    PHYSICAL_ASSAULT = 'Physical Assault',
    CUSTOM = 'custom complaint',
}

export enum UserRegistrationStage {
    VERIFY_EMAIL = 'verifyEmail',
    VERIFY_PROFILE = 'verifyProfile',
    COMPLETE = 'complete',
}

export enum Sexuality {
    HETEROSEXUAL = 'Heterosexual',
    QUEER = 'Queer',
    PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum Religion {
    CHRISTIANITY = "Christianity",
    ISLAM = "Islam",
    NON_RELIGIOUS = 'Non religious'
}


export enum Ethnicity {
    WHITE = 'White',
    BLACK_AFRICAN_AMERICAN = 'Black or African American',
    HISPANIC_LATINO = 'Hispanic or Latino',
    EAST_ASIAN = 'East Asian',
    SOUTHEAST_ASIAN = 'Southeast Asian',
    SOUTH_ASIAN = 'South Asian',
    NATIVE_HAWAIIAN = 'Native Hawaiian or Other Pacific Islander',
    AMERICAN_INDIAN = 'American Indian or Alaska Native',
    MIDDLE_EASTERN_NORTH_AFRICAN = 'Middle Eastern or North African',
    MIXED = 'Mixed',
}

export enum Currency {
    NGN = "Naira"
}

export enum ApartmentType {
    STUDIO = "Studio",
    // ONE_BEDROOM = "One bedroom",
    FLAT = "Flat",
    // THREE_BEDROOM = "Three bedroom flat",
    COMMUNAL = "Communual",
    LOFT = "loft",
    // MINI_FLAT = "Mini flat",
    SELF_CONTAIN = "Self contain",
    // FLAT = "flat",
    // CONDOMINIUM = "condominium",

    // BUNGALOW = "bungalow",
    // TERRACE = "terrace",
    // TOWNHOUSE = "townhouse",
    // APARTMENT = "apartment",
    // VILLA = "villa",
    // DUPLEX = "duplex",
    // RYAD = "ryad",
    // CHALET = "chalet"
}

export enum Amenities {
    WIFI = "Wifi",
    AIR_CONDITIONING = "Air conditioning",
    OVEN = "Oven",
    MICROWAVE = "Microwave",
    PARKING = "Parking",
    GYM = "Gym",
    SWIMMING_POOL = "Swimming pool",
    HEATING = 'Heating',
    GARBAGE_COLLECTION = "Garbage collection",
    TV = "TV",
    GARDEN = "Garden",
    FURNISHED = "Furnished",
    DISHWASHER = "Dishwasher",
    GAS_COOKER = "Gas cooker",
    FIREPLACE = "Fireplace",
    INVERTER = "Inverter",
    SPA = "Spa",
    BUSINESS_CENTER = "Business_center",
    GENERATOR = "Generator",
    CLOSET = "Closet/Wardrobe",

}

export enum Safety {
    SECURITY = "Security/Gateman",
    SMOKE_DETECTOR = 'Smoke detector',
    FIRE_EXTINGUISHER = 'Fire extinguisher',
    FENCE = 'Fenced and gated'
}

export enum MeansOfTransportToMAjorRoad {
    BIKE = "Bike",
    CAR = 'Car',
    TREKKING = 'Trekking',
}

export enum HouseRules {
    PET_FRIENDLY = "Pet friendly",
    SMOKING_FRIENDLY = "Smoking friendly",
    CHILDREN_FRIENDLY = 'Chilldren friendly'
}

export enum Accessibility {
    WHEELCHAIR_ACCESSIBLE = "Wheelchair accessible",
    ELEVATOR = "Elevator",
    STAIRS = "Stairs"
}

export enum HouseRooms {
    LIVING_ROOM = "Living room",
    DINING_ROOM = "Dining room",
    STUDY_ROOM = "Study room",
    // HOME_OFFICE = "Home office",
    // GARAGE = "Garage",
    // GYM = "Gym",
    LAUNDRY_ROOM = "Laundry room",
    // LIBRARY = "Library",
    // FAMILY_ROOM = "Family room",
    // GAME_ROOM = "Game room",
    // PANTRY = "Pantry",
    // HALLWAY = "Hallway",
    // ATTIC = "Attic",
    BASEMENT = "Basement",
    // MUDROOM = "Mudroom",
    // CORRIDOR = "Corridor",
    // PATIO = "Patio",
    BALCONY = "Balcony",
    // SUNROOM = "Sunroom",
    STORAGE_ROOM = "Storage room"
}

export enum locationAccessibility {
    CAR = 'Car',
    MOTORCYCLE = 'Motorcycle/Bike',
    WALKABLE = 'Walkable',
    BOAT = 'Boat/Canoe'
}

export enum NearbyPlaces {
    MARKET = 'Market',
    GROCERY_STORE = 'Grocery Store',
    SCHOOL = 'School',
    HOSPITAL = 'Hospital',
    RESTAURANTS = 'Restaurants',
    PARK = 'Park',
    GYM = 'Gym',
    PUBLIC_TRANSPORT = 'Public Transport',
    SHOPPING_MALL = 'Shopping Mall',
    LIBRARY = 'Library',
    NIGHT_CLUBS = 'Night clubs',
    PHARMACY = 'Pharmacy',
    WORKSPACE = 'Workspace',
    SWIMMING_POOL = "Swimming pool",
    BANK = "Banks/ATMs"
}

export enum RentType {
    LONG = 'Long',
    // SHORT = 'Short',
    HANDOVER = 'HandOver',
}

export enum matchStatus {
    PENDING = 'Pending',
    REJECTED = 'Rejected',
    ACCEPTED = 'Accepted',
}

export enum UserStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
    BANNED = 'Banned',
}
