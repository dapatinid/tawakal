import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/penjualan/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::exportMethod
* @see app/Http/Controllers/PenjualanController.php:1475
* @route '/penjualan/export'
*/
exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: exportMethod.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

exportMethod.form = exportMethodForm

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/penjualan',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::index
* @see app/Http/Controllers/PenjualanController.php:287
* @route '/penjualan'
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
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/penjualan/buat/baru',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::create
* @see app/Http/Controllers/PenjualanController.php:29
* @route '/penjualan/buat/baru'
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
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/penjualan/store',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::store
* @see app/Http/Controllers/PenjualanController.php:38
* @route '/penjualan/store'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
export const print = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

print.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}/print',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return print.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
print.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: print.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
const printForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
printForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: print.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::print
* @see app/Http/Controllers/PenjualanController.php:1417
* @route '/penjualan/{order}/print'
*/
printForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
export const printLandscape = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printLandscape.url(args, options),
    method: 'get',
})

printLandscape.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}/printLandscape',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
printLandscape.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return printLandscape.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
printLandscape.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printLandscape.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
printLandscape.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: printLandscape.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
const printLandscapeForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printLandscape.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
printLandscapeForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printLandscape.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printLandscape
* @see app/Http/Controllers/PenjualanController.php:1445
* @route '/penjualan/{order}/printLandscape'
*/
printLandscapeForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printLandscape.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

printLandscape.form = printLandscapeForm

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
export const printPackingSlip = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printPackingSlip.url(args, options),
    method: 'get',
})

printPackingSlip.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}/printPackingSlip',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
printPackingSlip.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return printPackingSlip.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
printPackingSlip.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: printPackingSlip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
printPackingSlip.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: printPackingSlip.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
const printPackingSlipForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printPackingSlip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
printPackingSlipForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printPackingSlip.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::printPackingSlip
* @see app/Http/Controllers/PenjualanController.php:1460
* @route '/penjualan/{order}/printPackingSlip'
*/
printPackingSlipForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: printPackingSlip.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

printPackingSlip.form = printPackingSlipForm

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/penjualan/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
const showForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
showForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PenjualanController::show
* @see app/Http/Controllers/PenjualanController.php:387
* @route '/penjualan/{order}'
*/
showForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PenjualanController::editInfo
* @see app/Http/Controllers/PenjualanController.php:405
* @route '/penjualan/{order}/editinfo'
*/
export const editInfo = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

editInfo.definition = {
    methods: ["put"],
    url: '/penjualan/{order}/editinfo',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenjualanController::editInfo
* @see app/Http/Controllers/PenjualanController.php:405
* @route '/penjualan/{order}/editinfo'
*/
editInfo.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return editInfo.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::editInfo
* @see app/Http/Controllers/PenjualanController.php:405
* @route '/penjualan/{order}/editinfo'
*/
editInfo.put = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: editInfo.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenjualanController::editInfo
* @see app/Http/Controllers/PenjualanController.php:405
* @route '/penjualan/{order}/editinfo'
*/
const editInfoForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: editInfo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::editInfo
* @see app/Http/Controllers/PenjualanController.php:405
* @route '/penjualan/{order}/editinfo'
*/
editInfoForm.put = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
export const destroy = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/penjualan/{order}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroy.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return destroy.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroy.delete = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
const destroyForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroy
* @see app/Http/Controllers/PenjualanController.php:148
* @route '/penjualan/{order}'
*/
destroyForm.delete = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::storeItem
* @see app/Http/Controllers/PenjualanController.php:435
* @route '/penjualan/{order}/item'
*/
export const storeItem = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

storeItem.definition = {
    methods: ["post"],
    url: '/penjualan/{order}/item',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PenjualanController::storeItem
* @see app/Http/Controllers/PenjualanController.php:435
* @route '/penjualan/{order}/item'
*/
storeItem.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return storeItem.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::storeItem
* @see app/Http/Controllers/PenjualanController.php:435
* @route '/penjualan/{order}/item'
*/
storeItem.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::storeItem
* @see app/Http/Controllers/PenjualanController.php:435
* @route '/penjualan/{order}/item'
*/
const storeItemForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::storeItem
* @see app/Http/Controllers/PenjualanController.php:435
* @route '/penjualan/{order}/item'
*/
storeItemForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeItem.url(args, options),
    method: 'post',
})

storeItem.form = storeItemForm

/**
* @see \App\Http\Controllers\PenjualanController::updateItem
* @see app/Http/Controllers/PenjualanController.php:485
* @route '/item-penjualan/{item}'
*/
export const updateItem = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

updateItem.definition = {
    methods: ["put"],
    url: '/item-penjualan/{item}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenjualanController::updateItem
* @see app/Http/Controllers/PenjualanController.php:485
* @route '/item-penjualan/{item}'
*/
updateItem.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\PenjualanController::updateItem
* @see app/Http/Controllers/PenjualanController.php:485
* @route '/item-penjualan/{item}'
*/
updateItem.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateItem.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenjualanController::updateItem
* @see app/Http/Controllers/PenjualanController.php:485
* @route '/item-penjualan/{item}'
*/
const updateItemForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::updateItem
* @see app/Http/Controllers/PenjualanController.php:485
* @route '/item-penjualan/{item}'
*/
updateItemForm.put = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::destroyItem
* @see app/Http/Controllers/PenjualanController.php:686
* @route '/item-penjualan/{item}'
*/
export const destroyItem = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

destroyItem.definition = {
    methods: ["delete"],
    url: '/item-penjualan/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PenjualanController::destroyItem
* @see app/Http/Controllers/PenjualanController.php:686
* @route '/item-penjualan/{item}'
*/
destroyItem.url = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\PenjualanController::destroyItem
* @see app/Http/Controllers/PenjualanController.php:686
* @route '/item-penjualan/{item}'
*/
destroyItem.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyItem.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroyItem
* @see app/Http/Controllers/PenjualanController.php:686
* @route '/item-penjualan/{item}'
*/
const destroyItemForm = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyItem.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroyItem
* @see app/Http/Controllers/PenjualanController.php:686
* @route '/item-penjualan/{item}'
*/
destroyItemForm.delete = (args: { item: number | { id: number } } | [item: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::biayaLain
* @see app/Http/Controllers/PenjualanController.php:806
* @route '/penjualan/{order}/biayalain'
*/
export const biayaLain = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: biayaLain.url(args, options),
    method: 'put',
})

biayaLain.definition = {
    methods: ["put"],
    url: '/penjualan/{order}/biayalain',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenjualanController::biayaLain
* @see app/Http/Controllers/PenjualanController.php:806
* @route '/penjualan/{order}/biayalain'
*/
biayaLain.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return biayaLain.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::biayaLain
* @see app/Http/Controllers/PenjualanController.php:806
* @route '/penjualan/{order}/biayalain'
*/
biayaLain.put = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: biayaLain.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenjualanController::biayaLain
* @see app/Http/Controllers/PenjualanController.php:806
* @route '/penjualan/{order}/biayalain'
*/
const biayaLainForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: biayaLain.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::biayaLain
* @see app/Http/Controllers/PenjualanController.php:806
* @route '/penjualan/{order}/biayalain'
*/
biayaLainForm.put = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::storePayment
* @see app/Http/Controllers/PenjualanController.php:841
* @route '/penjualan/{order}/pembayaran'
*/
export const storePayment = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

storePayment.definition = {
    methods: ["post"],
    url: '/penjualan/{order}/pembayaran',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PenjualanController::storePayment
* @see app/Http/Controllers/PenjualanController.php:841
* @route '/penjualan/{order}/pembayaran'
*/
storePayment.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { order: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            order: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        order: typeof args.order === 'object'
        ? args.order.id
        : args.order,
    }

    return storePayment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PenjualanController::storePayment
* @see app/Http/Controllers/PenjualanController.php:841
* @route '/penjualan/{order}/pembayaran'
*/
storePayment.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::storePayment
* @see app/Http/Controllers/PenjualanController.php:841
* @route '/penjualan/{order}/pembayaran'
*/
const storePaymentForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::storePayment
* @see app/Http/Controllers/PenjualanController.php:841
* @route '/penjualan/{order}/pembayaran'
*/
storePaymentForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storePayment.url(args, options),
    method: 'post',
})

storePayment.form = storePaymentForm

/**
* @see \App\Http\Controllers\PenjualanController::updatePayment
* @see app/Http/Controllers/PenjualanController.php:896
* @route '/pembayaran-penjualan/{payment}'
*/
export const updatePayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

updatePayment.definition = {
    methods: ["put"],
    url: '/pembayaran-penjualan/{payment}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PenjualanController::updatePayment
* @see app/Http/Controllers/PenjualanController.php:896
* @route '/pembayaran-penjualan/{payment}'
*/
updatePayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\PenjualanController::updatePayment
* @see app/Http/Controllers/PenjualanController.php:896
* @route '/pembayaran-penjualan/{payment}'
*/
updatePayment.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePayment.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PenjualanController::updatePayment
* @see app/Http/Controllers/PenjualanController.php:896
* @route '/pembayaran-penjualan/{payment}'
*/
const updatePaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::updatePayment
* @see app/Http/Controllers/PenjualanController.php:896
* @route '/pembayaran-penjualan/{payment}'
*/
updatePaymentForm.put = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PenjualanController::destroyPayment
* @see app/Http/Controllers/PenjualanController.php:989
* @route '/pembayaran-penjualan/{payment}'
*/
export const destroyPayment = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

destroyPayment.definition = {
    methods: ["delete"],
    url: '/pembayaran-penjualan/{payment}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PenjualanController::destroyPayment
* @see app/Http/Controllers/PenjualanController.php:989
* @route '/pembayaran-penjualan/{payment}'
*/
destroyPayment.url = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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
* @see \App\Http\Controllers\PenjualanController::destroyPayment
* @see app/Http/Controllers/PenjualanController.php:989
* @route '/pembayaran-penjualan/{payment}'
*/
destroyPayment.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyPayment.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroyPayment
* @see app/Http/Controllers/PenjualanController.php:989
* @route '/pembayaran-penjualan/{payment}'
*/
const destroyPaymentForm = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PenjualanController::destroyPayment
* @see app/Http/Controllers/PenjualanController.php:989
* @route '/pembayaran-penjualan/{payment}'
*/
destroyPaymentForm.delete = (args: { payment: number | { id: number } } | [payment: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroyPayment.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroyPayment.form = destroyPaymentForm

const PenjualanController = { exportMethod, index, create, store, print, printLandscape, printPackingSlip, show, editInfo, destroy, storeItem, updateItem, destroyItem, biayaLain, storePayment, updatePayment, destroyPayment, export: exportMethod }

export default PenjualanController