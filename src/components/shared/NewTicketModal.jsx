import { useState, useEffect } from "react"
import { useFetcher } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MapPin,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  AlertTriangle,
  Phone,
} from "lucide-react"

// Keep priorities hardcoded as specified
const priorities = [
  {
    value: "low",
    label: "Low Priority",
    description: "Non-urgent, can wait",
    color: "bg-green-50 text-green-700 border-green-200",
    icon: Clock,
  },
  {
    value: "medium",
    label: "Medium Priority",
    description: "Normal business impact",
    color: "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: AlertCircle,
  },
  {
    value: "high",
    label: "High Priority",
    description: "Affects patient care or critical operations",
    color: "bg-orange-50 text-orange-700 border-orange-200",
    icon: AlertTriangle,
  },
]

export function NewTicketModal({ 
  open, 
  onOpenChange, 
  preselectedCategory,
  categories = [], // Categories with merged data from parent
  locations = [],  // Locations based on user's department
  user = null     // User data with department info
}) {
  const fetcher = useFetcher()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    location: "",
    contactPhone: "",
    patientName: "",
    equipmentDetails: "",
    urgencyReason: "",
  })
  const [errors, setErrors] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Handle fetcher state changes
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.success) {
      // Success - move to step 3
      setCurrentStep(3)
      
      // Auto-close modal after 3 seconds on success
      const timer = setTimeout(() => {
        handleCloseModal()
      }, 3000)
      
      return () => clearTimeout(timer)
    }
    
    if (fetcher.state === "idle" && fetcher.data?.error) {
      // Handle errors from action
      setErrors({ submit: fetcher.data.error })
    }
  }, [fetcher.state, fetcher.data])

  // Handle preselected category
  useEffect(() => {
    if (preselectedCategory && open && categories.length > 0) {
      const category = categories.find((cat) => cat.id === preselectedCategory)
      if (category) {
        handleCategorySelect(category)
      }
    }
  }, [preselectedCategory, open, categories])

  const validateStep = (step) => {
    const newErrors = {}

    if (step === 1) {
      if (!formData.category) newErrors.category = "Please select a category"
      if (!formData.title.trim()) newErrors.title = "Title is required"
      if (!formData.description.trim()) newErrors.description = "Description is required"
    }

    if (step === 2) {
      if (!formData.location) newErrors.location = "Location is required"
      if (!formData.contactPhone.trim()) newErrors.contactPhone = "Contact phone is required"
      if ((formData.priority === "High" || formData.priority === "Critical") && !formData.urgencyReason.trim()) {
        newErrors.urgencyReason = "Please explain why this is urgent"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setErrors({})
  }

  const handleSubmit = () => {
    if (!validateStep(2)) return

    // Submit using fetcher
    const submitData = {
      ...formData,
      category_id: selectedCategory?.id, // ✅ Use the database ID directly
      department: user?.department?.name, // Auto-populate from user
      department_id: user?.department?.id,
    }

    console.log('Submitting ticket data:', submitData)

    // Submit to current route's action
    fetcher.submit(submitData, { method: "post" })
  }

  const handleCloseModal = () => {
    // Reset form state
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      location: "",
      contactPhone: "",
      patientName: "",
      equipmentDetails: "",
      urgencyReason: "",
    })
    setCurrentStep(1)
    setSelectedCategory(null)
    setErrors({})
    onOpenChange(false)
  }

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category: category.id })
    setSelectedCategory(category)
    if (errors.category) {
      setErrors({ ...errors, category: "" })
    }
  }

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  const isSubmitting = fetcher.state === "submitting"

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">What type of issue are you experiencing?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = formData.category === category.id
            return (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md  ${
                  isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => handleCategorySelect(category)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${isSelected ? "bg-blue-500 text-white" : "bg-gray-100"}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* ✅ Use 'title' instead of 'label' */}
                      <h4 className="font-medium text-sm">{category.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">{category.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
        {errors.category && <p className="text-sm text-red-500 mt-2">{errors.category}</p>}
      </div>

      {selectedCategory && (
        <div className="bg-blue-50 p-4 rounded-lg">
          {/* ✅ Use 'title' instead of 'label' */}
          <h4 className="font-medium text-sm text-blue-900 mb-2">Common {selectedCategory.title} examples:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.examples?.map((example, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {example}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Issue Title *</Label>
          <Input
            id="title"
            placeholder="Brief description of the problem (e.g., 'Printer not working in OPD')"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <Label htmlFor="description">Detailed Description *</Label>
          <Textarea
            id="description"
            placeholder="Please provide detailed information about the issue. Include what you were trying to do, what happened, and any error messages you saw."
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={`min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <Label htmlFor="priority">Priority Level</Label>
          <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => {
                const Icon = priority.icon
                return (
                  <SelectItem key={priority.value} value={priority.value}>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <div>
                        <div className="font-medium">{priority.label}</div>
                        <div className="text-xs text-gray-500">{priority.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Location and Contact Information</h3>
      </div>

      {/* Show user's department (read-only) */}
      {user?.department && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <Label className="text-sm font-medium text-blue-900">Your Department</Label>
          <p className="text-blue-800 font-medium">{user.department.name}</p>
        </div>
      )}

      <div>
        <Label htmlFor="location">Specific Location *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
          <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
            <SelectTrigger className={`pl-10 ${errors.location ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
      </div>

      <div>
        <Label htmlFor="contactPhone">Contact Phone/Extension *</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="contactPhone"
            placeholder="Your phone number or extension"
            value={formData.contactPhone}
            onChange={(e) => handleInputChange("contactPhone", e.target.value)}
            className={`pl-10 ${errors.contactPhone ? "border-red-500" : ""}`}
          />
        </div>
        {errors.contactPhone && <p className="text-sm text-red-500 mt-1">{errors.contactPhone}</p>}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="patientName">Patient Name (if applicable)</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="patientName"
              placeholder="Patient name if this issue affects patient care"
              value={formData.patientName}
              onChange={(e) => handleInputChange("patientName", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="equipmentDetails">Equipment Details (if applicable)</Label>
          <Textarea
            id="equipmentDetails"
            placeholder="Brand, model, serial number, or any identifying information about the equipment"
            value={formData.equipmentDetails}
            onChange={(e) => handleInputChange("equipmentDetails", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        {formData.priority === "high" && (
          <div>
            <Label htmlFor="urgencyReason">Why is this urgent? *</Label>
            <Textarea
              id="urgencyReason"
              placeholder="Please explain why this issue requires immediate attention"
              value={formData.urgencyReason}
              onChange={(e) => handleInputChange("urgencyReason", e.target.value)}
              className={`min-h-[80px] ${errors.urgencyReason ? "border-red-500" : ""}`}
            />
            {errors.urgencyReason && <p className="text-sm text-red-500 mt-1">{errors.urgencyReason}</p>}
          </div>
        )}
      </div>

      {/* Show submission error if any */}
      {errors.submit && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Need immediate help?</strong> For critical emergencies affecting patient care, please call IT Support
          directly at <strong>ext. 2847</strong> in addition to submitting this ticket.
        </AlertDescription>
      </Alert>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-green-900">Ticket Submitted Successfully!</h3>
        <p className="text-gray-600 mt-2">
          Your support ticket has been created and assigned ticket number{" "}
          <strong className="text-blue-600">#{fetcher.data?.ticketNumber || 'TBD'}</strong>
        </p>
      </div>
      <div className="bg-blue-50 p-4 rounded-lg text-left">
        <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• IT Support will review your ticket within 15 minutes</li>
          <li>• You'll receive email updates on ticket progress</li>
          <li>• For urgent issues, someone will contact you directly</li>
          <li>• You can track your ticket status in the system</li>
        </ul>
      </div>
    </div>
  )

  // Debug component props
  console.log('Modal props:', { 
    categoriesCount: categories.length, 
    locationsCount: locations.length, 
    user,
    selectedCategory 
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-500" />
            <span>Submit New IT Support Ticket</span>
          </DialogTitle>
          <DialogDescription>
            {currentStep === 1 && "Tell us about your IT issue so we can help you quickly"}
            {currentStep === 2 && "Provide your location and contact details"}
            {currentStep === 3 && "Your ticket has been submitted"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-4 py-4">
          {[1, 2].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step
                    ? "bg-blue-500 text-white"
                    : currentStep === 3
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep === 3 && step === 2 ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 2 && (
                <div
                  className={`w-16 h-1 mx-2 ${
                    currentStep > step ? "bg-blue-500" : currentStep === 3 ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="py-4">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <DialogFooter>
          {currentStep === 1 && (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button onClick={handleNext}>Next Step</Button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="flex justify-between w-full">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </div>
          )}
          {currentStep === 3 && (
            <Button onClick={handleCloseModal} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}