const Mathang = require('../models/mathang')
const mongoose = require('mongoose')
const fileHelper = require('../../util/file')
const { response } = require('express')

class BanhangController {

    // [GET] /admin/banhang

    getHomePage(req, res, next) {
        Mathang.find({}).lean()
            .then(products => {
                // console.log(products)
                res.render('banhang/trangchu', {
                    products: products
                })
            })
            .catch(err => next(err))
    }

    // [GET] /admin/banhang/quanlymathang

    getProductList(req, res, next) {
        Mathang.find({}).lean()
            .then(products => {
                // console.log(products)
                res.render('banhang/danh-sach-mat-hang', {
                    products: products
                })
            })
            .catch(err => next(err))
    }

    // [GET] /admin/banhang/quanlymathang/:id
    getProductDetail(req, res, next) {
        Mathang.findOne({ _id: req.params.id }).lean()
            .then(product => {
                // console.log(product)
                res.render('banhang/chi-tiet-mat-hang', {
                    product: product
                })
            })
            .catch(err => next(err))
    }

    // [GET] /admin/banhang/quanlymathang/:id/sua
    getUpdateProduct(req, res, next) {
        Mathang.findOne({ _id: req.params.id }).lean()
            .then(product => {
                if (!product) {
                    res.redirect('/')
                } else {
                    // console.log(product)
                    res.render('banhang/sua-mat-hang', {
                        product: product
                    })
                }
            })
            .catch(err => next(err))
    }

    // [POST] /admin/banhang/quanlymathang/:id/sua
    postUpdateProduct(req, res, next) {
        const productId = req.body.productId
        const updatedName = req.body.name
        const updatedPrice = req.body.price
        const updatedQuantity = req.body.quantity
        const image = req.file
        console.log(image)

        Mathang.findById(productId)
            .then(product => {
                product.name = updatedName
                product.price = updatedPrice
                product.quantity = updatedQuantity
                if (image) {
                    fileHelper.deleteFile(product.imageUrl)
                    product.imageUrl = image.path
                }

                return product.save()
                    .then(result => {
                        res.redirect('/admin/banhang/quanlymathang')
                    })
            })
            .catch(err => next(err))
    }

    // [POST] /admin/banhang/quanlymathang/:id/xoa
    postDeleteProduct(req, res, next) {
        const productId = req.params.id
        Mathang.findById(productId)
            .then(product => {
                if (!product) {
                    console.log('KHONG TON TAI MAT HANG')
                    return
                }
                fileHelper.deleteFile(product.imageUrl)
                return Mathang.deleteOne({ _id: productId })
            })
            .then(result => {
                res.redirect('/admin/banhang/quanlymathang')
            })
            .catch(err => next(err))
    }

    // [GET] /admin/banhang/themmathang
    getAddProductForm(req, res, next) {
        res.render('banhang/them-mat-hang')
    }


    // [POST] /admin/banhang/themmathang 
    postAddProduct(req, res, next) {
        const name = req.body.name
        const price = req.body.price
        const quantity = req.body.quantity
        const image = req.file

        if (!image) {
            console.log('Khong co anh')
            return
        }

        const imageUrl = image.path

        const product = new Mathang({
            name: name,
            price: price,
            quantity: quantity,
            imageUrl: imageUrl
        })

        product.save()
            .then(result => {
                res.redirect('/admin/banhang/quanlymathang')
            })
            .catch(err => next(err))
    }

}

module.exports = new BanhangController