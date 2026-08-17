import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pembelian',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::index
* @see app/Http/Controllers/PembelianController.php:348
* @route '/pembelian'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/pembelian/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::create
* @see app/Http/Controllers/PembelianController.php:25
* @route '/pembelian/buat/baru'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/pembelian/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::store
* @see app/Http/Controllers/PembelianController.php:34
* @route '/pembelian/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
export const print = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/pembelian/{purchaseOrder}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return print.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.get = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
print.head = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
const printForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
printForm.get = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::print
* @see app/Http/Controllers/PembelianController.php:1503
* @route '/pembelian/{purchaseOrder}/print'
*/
printForm.head = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

print.form = printForm

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
export const show = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/pembelian/{purchaseOrder}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return show.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.get = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
show.head = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
const showForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
showForm.get = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PembelianController::show
* @see app/Http/Controllers/PembelianController.php:448
* @route '/pembelian/{purchaseOrder}'
*/
showForm.head = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PembelianController::editInfo
* @see app/Http/Controllers/PembelianController.php:466
* @route '/pembelian/{purchaseOrder}/editinfo'
*/
export const editInfo = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

editInfo.definition = {
    methods: ["put"],
    url: '/pembelian/{purchaseOrder}/editinfo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PembelianController::editInfo
* @see app/Http/Controllers/PembelianController.php:466
* @route '/pembelian/{purchaseOrder}/editinfo'
*/
editInfo.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return editInfo.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::editInfo
* @see app/Http/Controllers/PembelianController.php:466
* @route '/pembelian/{purchaseOrder}/editinfo'
*/
editInfo.put = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PembelianController::editInfo
* @see app/Http/Controllers/PembelianController.php:466
* @route '/pembelian/{purchaseOrder}/editinfo'
*/
const editInfoForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: editInfo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::editInfo
* @see app/Http/Controllers/PembelianController.php:466
* @route '/pembelian/{purchaseOrder}/editinfo'
*/
editInfoForm.put = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: editInfo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

editInfo.form = editInfoForm

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
export const destroy = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/pembelian/{purchaseOrder}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroy.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return destroy.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroy.delete = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
const destroyForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::destroy
* @see app/Http/Controllers/PembelianController.php:144
* @route '/pembelian/{purchaseOrder}'
*/
destroyForm.delete = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\PembelianController::storeItem
* @see app/Http/Controllers/PembelianController.php:491
* @route '/pembelian/{purchaseOrder}/item'
*/
export const storeItem = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/pembelian/{purchaseOrder}/item',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PembelianController::storeItem
* @see app/Http/Controllers/PembelianController.php:491
* @route '/pembelian/{purchaseOrder}/item'
*/
storeItem.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return storeItem.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::storeItem
* @see app/Http/Controllers/PembelianController.php:491
* @route '/pembelian/{purchaseOrder}/item'
*/
storeItem.post = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::storeItem
* @see app/Http/Controllers/PembelianController.php:491
* @route '/pembelian/{purchaseOrder}/item'
*/
const storeItemForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::storeItem
* @see app/Http/Controllers/PembelianController.php:491
* @route '/pembelian/{purchaseOrder}/item'
*/
storeItemForm.post = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

storeItem.form = storeItemForm

/**
* @see \App\Http\Controllers\PembelianController::updateItem
* @see app/Http/Controllers/PembelianController.php:609
* @route '/item-pembelian/{item}'
*/
export const updateItem = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

updateItem.definition = {
    methods: ["put"],
    url: '/item-pembelian/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PembelianController::updateItem
* @see app/Http/Controllers/PembelianController.php:609
* @route '/item-pembelian/{item}'
*/
updateItem.url = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return updateItem.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::updateItem
* @see app/Http/Controllers/PembelianController.php:609
* @route '/item-pembelian/{item}'
*/
updateItem.put = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PembelianController::updateItem
* @see app/Http/Controllers/PembelianController.php:609
* @route '/item-pembelian/{item}'
*/
const updateItemForm = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::updateItem
* @see app/Http/Controllers/PembelianController.php:609
* @route '/item-pembelian/{item}'
*/
updateItemForm.put = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateItem.form = updateItemForm

/**
* @see \App\Http\Controllers\PembelianController::destroyItem
* @see app/Http/Controllers/PembelianController.php:831
* @route '/item-pembelian/{item}'
*/
export const destroyItem = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

destroyItem.definition = {
    methods: ["delete"],
    url: '/item-pembelian/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PembelianController::destroyItem
* @see app/Http/Controllers/PembelianController.php:831
* @route '/item-pembelian/{item}'
*/
destroyItem.url = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { item: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { item: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            item: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        item: typeof args.item === 'object'
        ? args.item.id
        : args.item,
    }

    return destroyItem.definition.url
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::destroyItem
* @see app/Http/Controllers/PembelianController.php:831
* @route '/item-pembelian/{item}'
*/
destroyItem.delete = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PembelianController::destroyItem
* @see app/Http/Controllers/PembelianController.php:831
* @route '/item-pembelian/{item}'
*/
const destroyItemForm = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::destroyItem
* @see app/Http/Controllers/PembelianController.php:831
* @route '/item-pembelian/{item}'
*/
destroyItemForm.delete = (args: { item: string | number | { id: string | number } } | [item: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyItem.form = destroyItemForm

/**
* @see \App\Http\Controllers\PembelianController::biayaLain
* @see app/Http/Controllers/PembelianController.php:981
* @route '/pembelian/{purchaseOrder}/biayalain'
*/
export const biayaLain = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: biayaLain.url(args, options),
    method: 'put',
})

biayaLain.definition = {
    methods: ["put"],
    url: '/pembelian/{purchaseOrder}/biayalain',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PembelianController::biayaLain
* @see app/Http/Controllers/PembelianController.php:981
* @route '/pembelian/{purchaseOrder}/biayalain'
*/
biayaLain.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return biayaLain.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::biayaLain
* @see app/Http/Controllers/PembelianController.php:981
* @route '/pembelian/{purchaseOrder}/biayalain'
*/
biayaLain.put = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: biayaLain.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PembelianController::biayaLain
* @see app/Http/Controllers/PembelianController.php:981
* @route '/pembelian/{purchaseOrder}/biayalain'
*/
const biayaLainForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: biayaLain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::biayaLain
* @see app/Http/Controllers/PembelianController.php:981
* @route '/pembelian/{purchaseOrder}/biayalain'
*/
biayaLainForm.put = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: biayaLain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

biayaLain.form = biayaLainForm

/**
* @see \App\Http\Controllers\PembelianController::storePayment
* @see app/Http/Controllers/PembelianController.php:1011
* @route '/pembelian/{purchaseOrder}/pembayaran'
*/
export const storePayment = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/pembelian/{purchaseOrder}/pembayaran',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PembelianController::storePayment
* @see app/Http/Controllers/PembelianController.php:1011
* @route '/pembelian/{purchaseOrder}/pembayaran'
*/
storePayment.url = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { purchaseOrder: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { purchaseOrder: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            purchaseOrder: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        purchaseOrder: typeof args.purchaseOrder === 'object'
        ? args.purchaseOrder.id
        : args.purchaseOrder,
    }

    return storePayment.definition.url
            .replace('{purchaseOrder}', parsedArgs.purchaseOrder.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::storePayment
* @see app/Http/Controllers/PembelianController.php:1011
* @route '/pembelian/{purchaseOrder}/pembayaran'
*/
storePayment.post = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::storePayment
* @see app/Http/Controllers/PembelianController.php:1011
* @route '/pembelian/{purchaseOrder}/pembayaran'
*/
const storePaymentForm = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::storePayment
* @see app/Http/Controllers/PembelianController.php:1011
* @route '/pembelian/{purchaseOrder}/pembayaran'
*/
storePaymentForm.post = (args: { purchaseOrder: string | number | { id: string | number } } | [purchaseOrder: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

storePayment.form = storePaymentForm

/**
* @see \App\Http\Controllers\PembelianController::updatePayment
* @see app/Http/Controllers/PembelianController.php:1049
* @route '/pembayaran-pembelian/{payment}'
*/
export const updatePayment = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

updatePayment.definition = {
    methods: ["put"],
    url: '/pembayaran-pembelian/{payment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PembelianController::updatePayment
* @see app/Http/Controllers/PembelianController.php:1049
* @route '/pembayaran-pembelian/{payment}'
*/
updatePayment.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return updatePayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::updatePayment
* @see app/Http/Controllers/PembelianController.php:1049
* @route '/pembayaran-pembelian/{payment}'
*/
updatePayment.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PembelianController::updatePayment
* @see app/Http/Controllers/PembelianController.php:1049
* @route '/pembayaran-pembelian/{payment}'
*/
const updatePaymentForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::updatePayment
* @see app/Http/Controllers/PembelianController.php:1049
* @route '/pembayaran-pembelian/{payment}'
*/
updatePaymentForm.put = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePayment.form = updatePaymentForm

/**
* @see \App\Http\Controllers\PembelianController::destroyPayment
* @see app/Http/Controllers/PembelianController.php:1110
* @route '/pembayaran-pembelian/{payment}'
*/
export const destroyPayment = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

destroyPayment.definition = {
    methods: ["delete"],
    url: '/pembayaran-pembelian/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PembelianController::destroyPayment
* @see app/Http/Controllers/PembelianController.php:1110
* @route '/pembayaran-pembelian/{payment}'
*/
destroyPayment.url = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { payment: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { payment: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            payment: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        payment: typeof args.payment === 'object'
        ? args.payment.id
        : args.payment,
    }

    return destroyPayment.definition.url
            .replace('{payment}', parsedArgs.payment.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PembelianController::destroyPayment
* @see app/Http/Controllers/PembelianController.php:1110
* @route '/pembayaran-pembelian/{payment}'
*/
destroyPayment.delete = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PembelianController::destroyPayment
* @see app/Http/Controllers/PembelianController.php:1110
* @route '/pembayaran-pembelian/{payment}'
*/
const destroyPaymentForm = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PembelianController::destroyPayment
* @see app/Http/Controllers/PembelianController.php:1110
* @route '/pembayaran-pembelian/{payment}'
*/
destroyPaymentForm.delete = (args: { payment: string | number | { id: string | number } } | [payment: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyPayment.form = destroyPaymentForm

const PembelianController = { index, create, store, print, show, editInfo, destroy, storeItem, updateItem, destroyItem, biayaLain, storePayment, updatePayment, destroyPayment }

export default PembelianController