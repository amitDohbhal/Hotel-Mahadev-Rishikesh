"use client";
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Star, Upload, Trash2 } from 'lucide-react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { Input } from '../ui/input';
// import { Textarea } from '../ui/textarea';
// import { Label } from '../ui/label';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function ProductInfoTabs({ product }) {
    // console.log(product)
    // Example: dynamic tab data from API/product object
    let tabs = [];
    // Collect reviews from product.reviews (array of objects)
    const reviews = Array.isArray(product?.reviews) ? product.reviews : [];

    // Static Reviews Tab with dynamic data
    // State for expanded reviews (array of booleans)
    const [expandedReviews, setExpandedReviews] = useState([]);
    const MAX_HEIGHT = 60; // px, adjust as needed

    const handleReadMore = (idx) => {
        setExpandedReviews(prev => {
            const next = [...prev];
            next[idx] = true;
            return next;
        });
    };

    // Add Review Button and Form State
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [localReviews, setLocalReviews] = useState(reviews);
    const [name, setName] = useState("");
    // const [rating, setRating] = useState(5);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [review, setReview] = useState("");

    // console.log(localReviews)

    // Fetch reviews from API
    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/productReviews?packageId=${product._id}`);
            const data = await response.json();
            const productReviews = response.ok ? (data.reviews || []) : [];
            // Fetch "packages" reviews (type=packages)
            const packageResponse = await fetch(`/api/saveReviews?type=packages&packageId=${product._id}&approved=true`);
            const packageData = await packageResponse.json();
            const packagesReviews = packageResponse.ok ? (packageData.reviews || []) : [];
            setLocalReviews([...productReviews, ...packagesReviews]);
        } catch (error) {
            // console.error('Error fetching reviews:', error);
            toast.error('Failed to fetch reviews');
        }
    };

    // Initial fetch of reviews
    useEffect(() => {
        if (product._id) {
            fetchReviews();
        }
    }, [product._id]);

    const [rating, setRating] = useState(0);
    const [date, setDate] = useState("");
    const [formError, setFormError] = useState('');

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (name === 'rating') {
            setRating(Number(value));
        } else {
            if (name === 'name') {
                setName(value);
            } else if (name === 'title') {
                setTitle(value);
            } else if (name === 'description') {
                setDescription(value);

            } else if (name === 'date') {
                setDate(value);
            }
        }
    };
    const handleStarClick = (num) => {
        setRating(num);
    };
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!rating || !title || !name || !date || !description || !imageObj.url) {
            setFormError('Please fill all required fields and rating.');
            return;
        }
        // Validate date is a valid date string
        if (isNaN(new Date(date).getTime())) {
            setFormError('Please enter a valid date.');
            return;
        }
        try {
            // Validate and log payload before sending
            const dateValue = date ? new Date(date).getTime() : undefined;
            const payload = {
                name,
                date: dateValue,
                thumb: imageObj.url ? {
                    url: imageObj.url,
                    key: imageObj.key
                } : null,
                rating,
                title,
                description, // must be non-empty string
                type: "packages",
                packages: product._id,
            };
            // console.log('Submitting review:', payload);
            if (!name || !date || !title || !description || !rating) {
                toast.error('All fields are required.');
                return;
            }
            const response = await fetch('/api/saveReviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                toast.error(data.error || 'Failed to submit review');
                // console.error('API Response:', data);
                return;
            }

            toast.success('Review submitted successfully!');
            setShowReviewForm(false);
            // Clear form state
            setName("");
            setTitle("");
            setRating(0);
            setDescription("");
            setDate("");
            // Clear image state
            setImageFile(null);
            setImagePreview(null);
            setImageObj({ url: '', key: '' });
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            // Refresh reviews
            await fetchReviews();
        } catch (error) {
            // console.error('Error:', error);
            toast.error('Error submitting review');
        } finally {
            setFormError('');
        }
    };

    // Image upload state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageObj, setImageObj] = useState({ url: '', key: '' });
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        setImageFile(file);
        if (file) {
            setUploading(true);
            toast.loading('Uploading image...', { id: 'review-image-upload' });

            // Preview
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);

            // Upload to Cloudinary
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'product_reviews');

            try {
                const res = await fetch('/api/cloudinary', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if (res.ok && data.url && data.key) {
                    setImageObj({ url: data.url, key: data.key });
                    toast.success('Image uploaded!', { id: 'review-image-upload' });
                } else {
                    toast.error('Cloudinary upload failed: ' + (data.error || 'Unknown error'), { id: 'review-image-upload' });
                }
            } catch (err) {
                toast.error('Cloudinary upload error: ' + err.message, { id: 'review-image-upload' });
            } finally {
                setUploading(false);
            }
        } else {
            setImagePreview(null);
            setImageObj({ url: '', key: '' });
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageObj({ url: '', key: '' });
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const reviewsTab = {
        label: "Reviews",
        content: (
            <div className="w-full max-w-3xl mx-auto text-left">
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-[#00b67a] text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-[#009e60] transition"
                        onClick={() => setShowReviewForm(v => !v)}
                    >
                        {showReviewForm ? 'Cancel' : 'Add Review'}
                    </button>
                </div>
                {showReviewForm && (
                    <form className="bg-[#fafbfc] border border-[#e6e7e9] rounded-xl px-6 py-6 shadow-sm mb-8 flex flex-col gap-4" onSubmit={handleSubmitReview}>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-semibold mb-1">Your Name *</label>
                                <input
                                    name="name"
                                    value={name}
                                    onChange={handleFormChange}
                                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b67a]"
                                    required
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-semibold mb-1">Review Title *</label>
                                <input
                                    name="title"
                                    value={title}
                                    onChange={handleFormChange}
                                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b67a]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex flex-col flex-1">
                                <label className="font-semibold mb-1">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={handleFormChange}
                                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b67a]"
                                />
                            </div>
                            <div className="flex flex-col flex-1">
                                <label className="font-semibold mb-1">Rating *</label>
                                <div className="flex items-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <span
                                            key={num}
                                            className={num <= rating ? 'text-[#00b67a] text-2xl cursor-pointer' : 'text-gray-300 text-2xl cursor-pointer'}
                                            onClick={() => handleStarClick(num)}
                                            role="button"
                                            aria-label={`Rate ${num} star${num > 1 ? 's' : ''}`}
                                        >★</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Your Review *</label>
                            <textarea
                                name="description"
                                value={description}
                                onChange={handleFormChange}
                                rows={4}
                                className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00b67a]"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1">Thumb Image</label>
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload Image
                                </Button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                                {imagePreview && (
                                    <div className="relative w-24 h-24">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {formError && <div className="text-red-600 font-semibold">{formError}</div>}
                        <button
                            type="submit"
                            className="bg-[#00b67a] text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-[#009e60] transition self-end"
                        >
                            Submit Review
                        </button>
                    </form>
                )}
                {localReviews.length === 0 ? (
                    <div className="text-gray-500">No reviews yet.</div>
                ) : (
                    <div className="space-y-6">
                        {localReviews.map((review, idx) => {
                            const isExpanded = expandedReviews[idx];
                            return (
                                <div key={idx} className="bg-[#fafbfc] border border-[#e6e7e9] rounded-xl px-6 py-6 shadow-sm flex flex-col gap-2">
                                    <div className="flex items-center gap-2 mb-2">
                                        {/* Trustpilot/Star icons */}
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < (review.rating || 0) ? 'text-[#00b67a] text-xl' : 'text-gray-300 text-xl'}>★</span>
                                            ))}
                                        </div>
                                        <span className="ml-1 text-[#00b67a] font-bold text-xs flex items-center gap-1">
                                            <svg className="inline-block" width="16" height="16" viewBox="0 0 24 24" fill="#00b67a"><circle cx="12" cy="12" r="12" /><path fill="#fff" d="M10.5 16.5l-4-4 1.41-1.41L10.5 13.67l5.59-5.59L17.5 9.5z" /></svg>
                                            Verified
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                            {review?.image?.url || review?.thumb?.url ? (
                                                <img
                                                    src={review.image?.url || review?.thumb?.url}
                                                    alt="Reviewer"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            )}
                                        </div>

                                        <span className="font-bold text-base">{review.createdBy || review.name || 'Anonymous'}</span>
                                        <div className="flex items-center gap-2 text-gray-700 text-sm">

                                            <span className="text-xs">{review.createdAt || review.date ? `${Math.round((Date.now() - new Date(review.createdAt || review.date)) / (1000 * 60 * 60 * 24))} days ago` : ''}</span>
                                        </div>
                                    </div>
                                    {/* Review content with Read more */}
                                    <div className="relative">
                                        <span className="font-bold text-base">{review.title || 'Anonymous'}</span>
                                        <div
                                            className={`text-gray-900 transition-all duration-300 mb-2 ${isExpanded ? '' : 'max-h-[65px] overflow-hidden'}`}
                                            style={!isExpanded ? { WebkitMaskImage: 'linear-gradient(180deg, #000 65%, transparent 100%)' } : {}}
                                        >
                                            {review.description || review.review}
                                        </div>
                                        {!isExpanded && (review.review || review.description) && ((review.review || review.description).length > 150) && (
                                            <div className="absolute bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-[#fafbfc] to-transparent pt-6">
                                                <button
                                                    className="text-[#00b67a] font-semibold text-base px-2 py-1 focus:outline-none hover:underline"
                                                    onClick={() => handleReadMore(idx)}
                                                >
                                                    Read more
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )
    };

    if (
        product &&
        product.info &&
        Array.isArray(product.info.info) &&
        product.info.info.length > 0
    ) {
        tabs = product.info.info.map(section => ({
            label: section.title,
            content: section.description
        }));
        tabs.push(reviewsTab);
    }
    const [activeTab, setActiveTab] = useState(0);
    return (
        <div className="w-full mt-10">
            <div className="border-b grid grid-cols-2 sm:flex flex-wrap justify-center gap-2 sm:gap-4">
                {tabs.map((tab, idx) => (
                    <button
                        key={tab.label}
                        className={`w-full sm:w-auto py-2 sm:py-3 px-2 sm:px-4 text-base sm:text-lg font-semibold focus:outline-none transition relative whitespace-nowrap ${activeTab === idx
                            ? "text-black border-b-2 border-black"
                            : "text-gray-900"
                            }`}
                        onClick={() => setActiveTab(idx)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="py-4 px-6 text-md text-gray-700 min-h-[64px] w-full md:w-[80%] mx-auto text-start">
                {tabs[activeTab]
                    ? (activeTab < tabs.length - 1
                        ? <div dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }} />
                        : tabs[activeTab].content)
                    : <span>No information available.</span>
                }
            </div>
        </div>
    );
}